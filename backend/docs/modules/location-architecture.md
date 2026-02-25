# 消费地址功能架构设计文档

## 1. 系统架构概览

### 1.1 功能模块划分

```
消费地址功能
├── 数据层
│   ├── Expense 模型扩展（添加 location 字段）
│   └── UserDefaultLocation 模型（新建）
├── 业务逻辑层
│   ├── 默认地址管理服务
│   ├── 地址查询服务
│   └── 地址统计服务
├── API 层
│   ├── 默认地址管理 API
│   ├── 支出 API 扩展
│   └── 地址查询统计 API
└── 前端层
    ├── 支出表单扩展
    ├── 默认地址管理页面
    ├── 地址时间轴页面
    └── 地址统计页面
```

### 1.2 数据流设计

```
用户操作流程：
1. 设置默认地址
   └─> UserDefaultLocation 模型存储
   
2. 创建支出记录
   ├─> 如果提供了 location，直接使用
   └─> 如果未提供 location，查询 UserDefaultLocation 获取默认地址
       └─> Expense 模型存储（location 字段）
       
3. 查询消费地址
   ├─> 从 Expense 模型聚合查询
   └─> 返回地址统计信息
   
4. 查看地址时间轴
   ├─> 从 Expense 模型按日期分组查询
   └─> 返回时间轴数据
```

## 2. 数据模型设计

### 2.1 Expense 模型扩展

**文件位置**：`backend/src/models/expense.ts`

**修改内容**：
```typescript
export interface IExpense {
  // ... 现有字段
  location?: string;  // 新增字段
}

const expenseSchema = new Schema<IExpense>({
  // ... 现有字段
  location: {
    type: String,
    maxlength: 200,
    trim: true
  }
}, {
  timestamps: true
});

// 新增索引
expenseSchema.index({ userId: 1, location: 1 });
expenseSchema.index({ userId: 1, date: -1, location: 1 });
```

### 2.2 UserDefaultLocation 模型

**文件位置**：`backend/src/models/user-default-location.ts`（新建）

**模型定义**：
```typescript
import { Schema, model } from 'mongoose';

export interface IUserDefaultLocation {
  userId: Schema.Types.ObjectId;
  startDate: Date;
  endDate?: Date;
  location: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userDefaultLocationSchema = new Schema<IUserDefaultLocation>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    default: null
  },
  location: {
    type: String,
    required: true,
    maxlength: 200,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// 索引
userDefaultLocationSchema.index({ userId: 1, startDate: -1, isActive: 1 });
userDefaultLocationSchema.index({ userId: 1, isActive: 1 });

export const UserDefaultLocation = model<IUserDefaultLocation>('UserDefaultLocation', userDefaultLocationSchema);
```

## 3. 业务逻辑层设计

### 3.1 默认地址管理服务

**文件位置**：`backend/src/services/default-location.ts`（新建）

**核心功能**：
1. **创建默认地址**
   - 验证时间段不重叠
   - 创建新记录

2. **查询默认地址**
   - 根据日期查询当前默认地址
   - 查询时间段内的所有默认地址

3. **更新默认地址**
   - 验证时间段不重叠
   - 更新记录

4. **删除默认地址**
   - 软删除（设置 isActive = false）

**关键方法**：
```typescript
// 检查时间段是否重叠
async checkTimeRangeOverlap(
  userId: string,
  startDate: Date,
  endDate: Date | null,
  excludeId?: string
): Promise<boolean>

// 根据日期获取默认地址
async getDefaultLocationByDate(
  userId: string,
  date: Date
): Promise<IUserDefaultLocation | null>

// 创建默认地址
async createDefaultLocation(
  userId: string,
  data: {
    startDate: Date;
    endDate?: Date;
    location: string;
  }
): Promise<IUserDefaultLocation>

// 更新默认地址
async updateDefaultLocation(
  userId: string,
  id: string,
  data: Partial<{
    startDate: Date;
    endDate: Date | null;
    location: string;
    isActive: boolean;
  }>
): Promise<IUserDefaultLocation>

// 删除默认地址
async deleteDefaultLocation(
  userId: string,
  id: string
): Promise<void>
```

### 3.2 地址查询服务

**文件位置**：`backend/src/services/location-query.ts`（新建）

**核心功能**：
1. **获取消费地址列表**
   - 聚合查询，按地址分组
   - 统计每个地址的消费次数和总金额

2. **获取地址时间轴**
   - 按日期和地址分组
   - 返回时间轴数据

3. **根据地址查询消费记录**
   - 查询指定地址的所有消费记录
   - 支持分页和筛选

**关键方法**：
```typescript
// 获取消费地址列表
async getLocationList(
  userId: string,
  options: {
    startDate?: Date;
    endDate?: Date;
    keyword?: string;
  }
): Promise<Array<{
  location: string;
  count: number;
  totalAmount: number;
  firstDate: Date;
  lastDate: Date;
}>>

// 获取地址时间轴
async getLocationTimeline(
  userId: string,
  options: {
    startDate?: Date;
    endDate?: Date;
    includeExpenses?: boolean;
  }
): Promise<Array<{
  date: Date;
  location: string;
  expenseCount: number;
  totalAmount: number;
  expenses?: Array<{
    id: string;
    category: string;
    amount: number;
    description?: string;
  }>;
}>>

// 根据地址查询消费记录
async getExpensesByLocation(
  userId: string,
  location: string,
  options: {
    startDate?: Date;
    endDate?: Date;
    page?: number;
    pageSize?: number;
  }
): Promise<{
  location: string;
  totalCount: number;
  totalAmount: number;
  expenses: Array<IExpense>;
}>
```

## 4. Controller 层设计

### 4.1 默认地址管理 Controller

**文件位置**：`backend/src/controllers/user-default-location.ts`（新建）

**主要方法**：
- `createDefaultLocation`: 创建默认地址
- `getDefaultLocations`: 获取默认地址列表
- `getCurrentDefaultLocation`: 获取当前默认地址
- `updateDefaultLocation`: 更新默认地址
- `deleteDefaultLocation`: 删除默认地址

### 4.2 支出 Controller 扩展

**文件位置**：`backend/src/controllers/expense.ts`

**修改内容**：
- `createExpense`: 添加地址处理逻辑
- `updateExpense`: 添加地址处理逻辑
- `getExpenses`: 添加地址筛选支持

**地址处理逻辑**：
```typescript
// 在创建支出时
if (!location) {
  // 根据日期查找默认地址
  const defaultLocation = await getDefaultLocationByDate(userId, date);
  location = defaultLocation?.location || null;
}
```

### 4.3 地址查询 Controller

**文件位置**：`backend/src/controllers/location.ts`（新建）

**主要方法**：
- `getLocationList`: 获取消费地址列表
- `getLocationTimeline`: 获取地址时间轴
- `getExpensesByLocation`: 根据地址查询消费记录

## 5. Route 层设计

### 5.1 默认地址管理路由

**文件位置**：`backend/src/routes/user-default-location.ts`（新建）

**路由定义**：
```typescript
router.post('/', createDefaultLocation);
router.get('/', getDefaultLocations);
router.get('/current', getCurrentDefaultLocation);
router.put('/:id', updateDefaultLocation);
router.delete('/:id', deleteDefaultLocation);
```

### 5.2 支出路由扩展

**文件位置**：`backend/src/routes/expense.ts`

**无需修改**：现有路由已支持扩展

### 5.3 地址查询路由

**文件位置**：`backend/src/routes/location.ts`（新建）

**路由定义**：
```typescript
router.get('/locations', getLocationList);
router.get('/locations/timeline', getLocationTimeline);
router.get('/locations/:location', getExpensesByLocation);
```

## 6. 前端设计

### 6.1 Store 设计

#### 6.1.1 DefaultLocation Store

**文件位置**：`frontend/src/stores/default-location.ts`（新建）

**状态定义**：
```typescript
const defaultLocations = ref<DefaultLocationData[]>([]);
const currentDefaultLocation = ref<DefaultLocationData | null>(null);
const loading = ref<boolean>(false);
const error = ref<string | null>(null);
```

**主要方法**：
- `fetchDefaultLocations`: 获取默认地址列表
- `fetchCurrentDefaultLocation`: 获取当前默认地址
- `createDefaultLocation`: 创建默认地址
- `updateDefaultLocation`: 更新默认地址
- `deleteDefaultLocation`: 删除默认地址

#### 6.1.2 Location Store

**文件位置**：`frontend/src/stores/location.ts`（新建）

**状态定义**：
```typescript
const locationList = ref<LocationStatData[]>([]);
const locationTimeline = ref<LocationTimelineData[]>([]);
const loading = ref<boolean>(false);
```

**主要方法**：
- `fetchLocationList`: 获取消费地址列表
- `fetchLocationTimeline`: 获取地址时间轴
- `fetchExpensesByLocation`: 根据地址查询消费记录

### 6.2 API 设计

#### 6.2.1 DefaultLocation API

**文件位置**：`frontend/src/api/default-location.ts`（新建）

**主要方法**：
- `getList`: 获取默认地址列表
- `getCurrent`: 获取当前默认地址
- `create`: 创建默认地址
- `update`: 更新默认地址
- `delete`: 删除默认地址

#### 6.2.2 Location API

**文件位置**：`frontend/src/api/location.ts`（新建）

**主要方法**：
- `getLocationList`: 获取消费地址列表
- `getLocationTimeline`: 获取地址时间轴
- `getExpensesByLocation`: 根据地址查询消费记录

### 6.3 组件设计

#### 6.3.1 ExpenseForm 扩展

**文件位置**：`frontend/src/components/ExpenseForm.vue`

**新增功能**：
- 地址输入框
- 显示当前默认地址
- 地址自动完成（基于历史地址）

#### 6.3.2 DefaultLocationManager

**文件位置**：`frontend/src/components/DefaultLocationManager.vue`（新建）

**功能**：
- 默认地址列表展示
- 添加/编辑默认地址表单
- 时间段冲突检测提示

#### 6.3.3 LocationTimeline

**文件位置**：`frontend/src/components/LocationTimeline.vue`（新建）

**功能**：
- 时间轴展示
- 日期筛选
- 地址详情展开

### 6.4 页面设计

#### 6.4.1 DefaultLocations 页面

**文件位置**：`frontend/src/views/DefaultLocations.vue`（新建）

**功能**：
- 默认地址管理
- 当前默认地址显示
- 时间段可视化

#### 6.4.2 LocationTimeline 页面

**文件位置**：`frontend/src/views/LocationTimeline.vue`（新建）

**功能**：
- 地址时间轴展示
- 筛选和搜索
- 统计信息

## 7. 数据库迁移

### 7.1 Expense 模型迁移

**迁移脚本**：`backend/src/scripts/migrate-expense-location.ts`（新建）

**迁移内容**：
1. 为 Expense 集合添加 `location` 字段（可选字段）
2. 创建索引：
   - `{ userId: 1, location: 1 }`
   - `{ userId: 1, date: -1, location: 1 }`

### 7.2 UserDefaultLocation 集合创建

**无需迁移**：新集合，首次使用时自动创建

## 8. 性能优化

### 8.1 数据库优化

1. **索引优化**
   - Expense 集合：为 location 字段创建索引
   - UserDefaultLocation 集合：为查询字段创建索引

2. **查询优化**
   - 使用聚合管道优化地址统计查询
   - 使用分页减少数据传输

### 8.2 前端优化

1. **数据缓存**
   - 默认地址列表缓存
   - 地址统计结果缓存

2. **虚拟滚动**
   - 时间轴列表使用虚拟滚动
   - 地址列表使用虚拟滚动

3. **懒加载**
   - 地址详情按需加载
   - 消费记录分页加载

## 9. 安全考虑

### 9.1 数据验证

1. **输入验证**
   - 地址长度限制（最大 200 字符）
   - 日期格式验证
   - 时间段逻辑验证

2. **权限控制**
   - 所有 API 需要 JWT 认证
   - 用户只能访问自己的数据

### 9.2 数据一致性

1. **时间段冲突检测**
   - 创建/更新默认地址时检测时间段重叠
   - 确保同一时间段只有一个激活的默认地址

2. **数据完整性**
   - 删除默认地址时检查依赖关系
   - 支出记录删除不影响地址统计

## 10. 测试策略

### 10.1 单元测试

1. **服务层测试**
   - 默认地址管理服务测试
   - 地址查询服务测试
   - 时间段冲突检测测试

2. **Controller 测试**
   - API 接口测试
   - 错误处理测试

### 10.2 集成测试

1. **API 集成测试**
   - 默认地址管理流程测试
   - 支出创建与地址关联测试
   - 地址查询统计测试

2. **前端集成测试**
   - 组件交互测试
   - 页面流程测试

### 10.3 性能测试

1. **数据库性能**
   - 大量数据查询性能
   - 聚合查询性能

2. **API 性能**
   - 响应时间测试
   - 并发请求测试



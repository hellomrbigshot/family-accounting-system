# 消费地址功能设计文档

## 1. 功能概述

### 1.1 需求描述
- 在支出记录中记录消费地址
- 支持设置默认地址，默认地址可以按时间段设置（每段时间可以不一致）
- 如果支出记录没有指定地址，则使用当前时间段的默认地址
- 可以根据消费地址查看去了哪些地方
- 可以按时间轴查看消费地址
- **多成员支持**：支持记录消费人员，按成员统计和查看地址（详见 [多成员场景设计](./location-multi-member.md)）

### 1.2 核心功能
1. **地址记录**：在创建/编辑支出时记录消费地址
2. **默认地址管理**：设置和管理不同时间段的默认地址
3. **地址查询**：根据地址查询消费记录
4. **地址统计**：统计去过的地点和消费情况
5. **时间轴查看**：按时间顺序查看消费地址

## 2. 数据模型设计

### 2.1 Expense 模型扩展

在现有的 `Expense` 模型中添加 `location` 字段：

```typescript
export interface IExpense {
  userId: Schema.Types.ObjectId;
  date: Date;
  category: Schema.Types.ObjectId;
  amount: number;
  description?: string;
  tags: Schema.Types.ObjectId[];
  isExtra: boolean;
  location?: string;  // 新增：消费地址
  member?: string;    // 新增：消费人员（可选，用于多成员场景）
  createdAt: Date;
  updatedAt: Date;
}
```

**字段说明**：
- `location`: 可选字段，字符串类型，最大长度 200 字符
- 如果未提供，系统会根据支出日期查找对应时间段的默认地址
- `member`: 可选字段，字符串类型，最大长度 50 字符，用于标识消费人员（多成员场景）

**索引优化**：
```typescript
expenseSchema.index({ userId: 1, location: 1 });
expenseSchema.index({ userId: 1, date: -1, location: 1 });
expenseSchema.index({ userId: 1, member: 1, location: 1 });
expenseSchema.index({ userId: 1, member: 1, date: -1 });
```

### 2.2 UserDefaultLocation 模型（新建）

用于存储用户在不同时间段的默认地址：

```typescript
export interface IUserDefaultLocation {
  userId: Schema.Types.ObjectId;
  startDate: Date;      // 默认地址生效开始日期
  endDate?: Date;        // 默认地址生效结束日期（可选，null表示永久有效）
  location: string;      // 默认地址
  isActive: boolean;     // 是否激活
  createdAt: Date;
  updatedAt: Date;
}
```

**字段说明**：
- `startDate`: 必填，默认地址开始生效的日期
- `endDate`: 可选，默认地址结束生效的日期，如果为 null 或未设置，表示永久有效
- `location`: 必填，默认地址，最大长度 200 字符
- `isActive`: 是否激活，用于软删除

**业务规则**：
- 同一用户在同一时间段只能有一个激活的默认地址
- 时间段不能重叠
- 如果存在多个时间段，系统会选择包含当前日期且未过期的默认地址

**索引设计**：
```typescript
userDefaultLocationSchema.index({ userId: 1, startDate: -1, isActive: 1 });
userDefaultLocationSchema.index({ userId: 1, isActive: 1 });
```

## 3. API 设计

### 3.1 支出相关 API 扩展

#### 3.1.1 创建支出（扩展）
**接口**：`POST /expenses`

**请求体扩展**：
```typescript
{
  date: string;
  category: string;
  amount: number;
  description?: string;
  tags?: string[];
  isExtra?: boolean;
  location?: string;  // 新增：消费地址（可选）
}
```

**逻辑处理**：
- 如果提供了 `location`，直接使用
- 如果未提供 `location`，根据 `date` 查找对应时间段的默认地址
- 如果找不到默认地址，`location` 为 `null`

#### 3.1.2 更新支出（扩展）
**接口**：`PUT /expenses/:id`

**请求体扩展**：
```typescript
{
  date: string;
  category: string;
  amount: number;
  description?: string;
  tags?: string[];
  isExtra?: boolean;
  location?: string;  // 新增：消费地址（可选）
}
```

#### 3.1.3 查询支出（扩展）
**接口**：`GET /expenses`

**查询参数扩展**：
```typescript
{
  startDate?: string;
  endDate?: string;
  category?: string;
  categories?: string[];
  isExtra?: boolean;
  tags?: string[];
  location?: string;  // 新增：按地址筛选
  member?: string;    // 新增：按成员筛选（多成员场景）
  members?: string[]; // 新增：按多个成员筛选（多成员场景）
  minAmount?: number;
  maxAmount?: number;
  // ... 其他现有参数
}
```

**响应体扩展**：
```typescript
{
  id: string;
  date: string;
  category: string;
  amount: number;
  description?: string;
  tags: string[];
  isExtra: boolean;
  location?: string;  // 新增：消费地址
  member?: string;    // 新增：消费人员（多成员场景）
  createdAt: string;
}
```

### 3.2 默认地址管理 API

#### 3.2.1 创建默认地址
**接口**：`POST /user-default-locations`

**请求体**：
```typescript
{
  startDate: string;    // YYYY-MM-DD 格式
  endDate?: string;     // YYYY-MM-DD 格式，可选
  location: string;     // 默认地址
}
```

**响应**：
```typescript
{
  message: string;
  defaultLocation: {
    id: string;
    userId: string;
    startDate: string;
    endDate?: string;
    location: string;
    isActive: boolean;
    createdAt: string;
  }
}
```

**业务逻辑**：
- 检查时间段是否与其他默认地址重叠
- 如果重叠，返回错误
- 创建新的默认地址记录

#### 3.2.2 获取默认地址列表
**接口**：`GET /user-default-locations`

**查询参数**：
```typescript
{
  startDate?: string;   // 查询开始日期
  endDate?: string;     // 查询结束日期
  includeInactive?: boolean;  // 是否包含非激活的地址
}
```

**响应**：
```typescript
[
  {
    id: string;
    userId: string;
    startDate: string;
    endDate?: string;
    location: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  }
]
```

#### 3.2.3 获取当前默认地址
**接口**：`GET /user-default-locations/current`

**查询参数**：
```typescript
{
  date?: string;  // 查询日期，默认为今天
}
```

**响应**：
```typescript
{
  id: string;
  userId: string;
  startDate: string;
  endDate?: string;
  location: string;
  isActive: boolean;
  createdAt: string;
}
```

**业务逻辑**：
- 根据提供的日期（或当前日期）查找对应的默认地址
- 查找规则：`startDate <= date <= endDate` 或 `startDate <= date && endDate === null`

#### 3.2.4 更新默认地址
**接口**：`PUT /user-default-locations/:id`

**请求体**：
```typescript
{
  startDate?: string;
  endDate?: string;
  location?: string;
  isActive?: boolean;
}
```

**响应**：
```typescript
{
  message: string;
  defaultLocation: {
    id: string;
    userId: string;
    startDate: string;
    endDate?: string;
    location: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  }
}
```

**业务逻辑**：
- 如果修改了时间段，需要检查是否与其他默认地址重叠
- 如果修改了 `isActive`，需要确保至少有一个激活的默认地址

#### 3.2.5 删除默认地址
**接口**：`DELETE /user-default-locations/:id`

**响应**：
```typescript
{
  message: string;
}
```

**业务逻辑**：
- 软删除：将 `isActive` 设置为 `false`
- 如果删除的是当前唯一的激活地址，返回警告

### 3.3 地址查询和统计 API

#### 3.3.1 获取消费地址列表
**接口**：`GET /expenses/locations`

**查询参数**：
```typescript
{
  startDate?: string;
  endDate?: string;
  keyword?: string;  // 地址关键词搜索
}
```

**响应**：
```typescript
[
  {
    location: string;
    count: number;        // 消费次数
    totalAmount: number;  // 总消费金额
    firstDate: string;   // 首次消费日期
    lastDate: string;    // 最后消费日期
  }
]
```

#### 3.3.2 获取地址时间轴
**接口**：`GET /expenses/locations/timeline`

**查询参数**：
```typescript
{
  startDate?: string;
  endDate?: string;
}
```

**响应**：
```typescript
[
  {
    date: string;
    location: string;
    expenseCount: number;  // 该日期在该地址的消费次数
    totalAmount: number;   // 该日期在该地址的总消费
    expenses: [            // 该日期在该地址的消费记录（可选，可通过参数控制）
      {
        id: string;
        category: string;
        amount: number;
        description?: string;
      }
    ]
  }
]
```

**业务逻辑**：
- 按日期分组，显示每天去过的地址
- 如果同一天有多个地址，分别显示
- 按日期倒序排列

#### 3.3.3 根据地址查询消费记录
**接口**：`GET /expenses/locations/:location`

**查询参数**：
```typescript
{
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}
```

**响应**：
```typescript
{
  location: string;
  totalCount: number;
  totalAmount: number;
  expenses: [
    {
      id: string;
      date: string;
      category: string;
      amount: number;
      description?: string;
      tags: string[];
      isExtra: boolean;
    }
  ]
}
```

## 4. 前端设计

### 4.1 支出表单扩展

在 `ExpenseForm.vue` 组件中添加地址输入：

**功能点**：
- 地址输入框（支持手动输入）
- 显示当前默认地址（根据支出日期）
- 快速选择最近使用的地址
- 地址输入框支持自动完成（基于历史地址）

**UI 设计**：
- 地址输入框位于描述输入框下方
- 显示当前默认地址提示（如果未输入地址）
- 支持清空地址（使用默认地址）

### 4.2 默认地址管理页面

**新建页面**：`views/DefaultLocations.vue`

**功能点**：
1. **默认地址列表**
   - 显示所有默认地址（按开始日期排序）
   - 显示时间段和地址内容
   - 标记当前生效的默认地址
   - 支持编辑、删除操作

2. **添加/编辑默认地址**
   - 开始日期选择
   - 结束日期选择（可选）
   - 地址输入
   - 时间段冲突检测提示

3. **当前默认地址显示**
   - 显示当前日期对应的默认地址
   - 支持快速修改

**UI 设计**：
- 使用时间轴样式展示默认地址
- 当前生效的地址高亮显示
- 支持时间段可视化展示

### 4.3 消费地址时间轴页面

**新建页面**：`views/LocationTimeline.vue`

**功能点**：
1. **时间轴展示**
   - 按日期倒序显示消费地址
   - 每天显示去过的地址
   - 显示该地址的消费次数和总金额
   - 支持点击查看详细消费记录

2. **筛选功能**
   - 按日期范围筛选
   - 按地址关键词搜索
   - 按消费金额筛选

3. **统计信息**
   - 总访问地址数
   - 总消费金额
   - 最常去的地址
   - 消费最多的地址

**UI 设计**：
- 使用时间轴组件（Vant Timeline）
- 每个地址显示在地图上（如果可能）
- 支持展开/收起查看详细消费记录

### 4.4 地址统计页面

**新建页面**：`views/LocationStats.vue`

**功能点**：
1. **地址列表**
   - 显示所有去过的地址
   - 按消费次数或金额排序
   - 显示访问次数、总金额、首次/最后访问日期

2. **地址详情**
   - 点击地址查看该地址的所有消费记录
   - 显示该地址的消费趋势图
   - 显示该地址的消费分类统计

3. **地图展示**（可选）
   - 在地图上标记去过的地址
   - 显示访问频率

**UI 设计**：
- 使用卡片列表展示地址
- 支持排序和筛选
- 集成地图组件（如果可能）

### 4.5 支出列表扩展

在 `Expenses.vue` 和 `ExpenseList.vue` 中：

**功能点**：
- 显示每条支出的消费地址
- 支持按地址筛选支出
- 点击地址跳转到该地址的消费记录页面

**UI 设计**：
- 在支出卡片中显示地址信息（如果有）
- 地址信息使用图标标识
- 支持地址筛选器

## 5. 数据迁移

### 5.1 现有数据迁移

对于现有的支出记录：
- `location` 字段为 `null` 或 `undefined`
- 如果需要，可以通过批量更新脚本为历史数据添加默认地址

### 5.2 迁移脚本

```typescript
// scripts/migrate-expense-locations.ts
// 为历史支出记录添加默认地址（如果需要）
```

## 6. 实施计划

### 6.1 第一阶段：数据模型和基础 API
1. 扩展 Expense 模型，添加 `location` 字段
2. 创建 UserDefaultLocation 模型
3. 实现默认地址管理 API
4. 扩展支出 API，支持地址字段

### 6.2 第二阶段：前端基础功能
1. 扩展支出表单，添加地址输入
2. 实现默认地址管理页面
3. 扩展支出列表，显示地址信息

### 6.3 第三阶段：查询和统计功能
1. 实现地址查询 API
2. 实现地址时间轴 API
3. 实现地址统计 API
4. 实现前端时间轴页面
5. 实现前端统计页面

### 6.4 第四阶段：优化和增强
1. 地址自动完成功能
2. 地址去重和标准化
3. 地图集成（可选）
4. 性能优化

## 7. 技术考虑

### 7.1 性能优化
- 为地址字段创建索引
- 地址查询使用聚合管道优化
- 前端使用虚拟滚动处理大量数据

### 7.2 数据一致性
- 默认地址时间段不能重叠
- 删除默认地址时检查依赖关系
- 支出记录删除不影响地址统计

### 7.3 用户体验
- 地址输入支持历史记录自动完成
- 默认地址自动填充
- 地址信息清晰展示
- 时间轴可视化展示

## 8. 测试要点

### 11.1 功能测试
- 创建支出时地址处理逻辑
- 默认地址时间段管理
- 地址查询和统计准确性
- 时间轴展示正确性

### 11.2 边界测试
- 时间段重叠检测
- 无默认地址时的处理
- 大量地址数据的性能
- 地址为空字符串的处理

### 11.3 集成测试
- 支出创建和地址关联
- 默认地址变更对历史数据的影响
- 地址查询和筛选功能


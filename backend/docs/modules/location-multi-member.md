# 消费地址功能 - 多成员场景设计

## 1. 场景说明

在家庭账户系统中，多个家庭成员可能共用一个账号（roomNumber），不同成员可能在不同地址消费。例如：
- 爸爸在北京工作，消费地址主要是北京
- 妈妈在上海工作，消费地址主要是上海
- 孩子在学校，消费地址主要是学校所在地

需要支持：
1. 记录每条支出的消费人员
2. 按成员统计消费地址
3. 按成员查看地址时间轴
4. 支持按成员筛选地址统计

## 2. 设计方案

### 2.1 方案选择

**方案A：简单成员字段（推荐）**
- 在 Expense 模型中添加可选的 `member` 字段（字符串）
- 优点：实现简单，向后兼容，灵活
- 缺点：成员信息没有统一管理，可能出现拼写不一致

**方案B：成员模型**
- 创建 FamilyMember 模型，统一管理成员
- Expense 关联到成员 ID
- 优点：成员信息统一管理，数据一致性好
- 缺点：需要额外的成员管理功能，复杂度较高

**推荐方案：方案A（简单成员字段）**
- 符合当前系统的简洁设计理念
- 向后兼容，不影响现有功能
- 用户可以根据需要选择是否使用成员功能
- 如果未来需要更复杂的成员管理，可以升级到方案B

### 2.2 数据模型扩展

#### 2.2.1 Expense 模型扩展

在现有的 Expense 模型中添加 `member` 字段：

```typescript
export interface IExpense {
  userId: Schema.Types.ObjectId;
  date: Date;
  category: Schema.Types.ObjectId;
  amount: number;
  description?: string;
  tags: Schema.Types.ObjectId[];
  isExtra: boolean;
  location?: string;      // 消费地址
  member?: string;        // 新增：消费人员（可选）
  createdAt: Date;
  updatedAt: Date;
}
```

**字段说明**：
- `member`: 可选字段，字符串类型，最大长度 50 字符
- 用于标识该笔支出的消费人员
- 如果未提供，表示不区分成员（适用于单用户场景）

**索引优化**：
```typescript
expenseSchema.index({ userId: 1, member: 1, location: 1 });
expenseSchema.index({ userId: 1, member: 1, date: -1 });
```

#### 2.2.2 UserDefaultLocation 模型扩展（可选）

如果需要支持按成员设置默认地址，可以扩展 UserDefaultLocation 模型：

```typescript
export interface IUserDefaultLocation {
  userId: Schema.Types.ObjectId;
  startDate: Date;
  endDate?: Date;
  location: string;
  member?: string;        // 新增：成员（可选）
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

**字段说明**：
- `member`: 可选字段，如果提供，表示该默认地址仅适用于指定成员
- 如果未提供，表示适用于所有成员（或不区分成员）

**业务规则**：
- 如果指定了 `member`，查询默认地址时需要同时匹配 `member` 和日期
- 如果未指定 `member`，查询默认地址时只匹配日期（适用于所有成员）

**索引优化**：
```typescript
userDefaultLocationSchema.index({ userId: 1, member: 1, startDate: -1, isActive: 1 });
```

### 2.3 API 扩展

#### 2.3.1 支出 API 扩展

**创建/更新支出**：
```typescript
{
  date: string;
  category: string;
  amount: number;
  description?: string;
  tags?: string[];
  isExtra?: boolean;
  location?: string;
  member?: string;  // 新增：消费人员（可选）
}
```

**查询支出**：
```typescript
// 查询参数扩展
{
  // ... 现有参数
  member?: string;        // 按成员筛选
  members?: string[];     // 按多个成员筛选
}
```

#### 2.3.2 地址统计 API 扩展

**获取消费地址列表**：
```typescript
// 查询参数
{
  startDate?: string;
  endDate?: string;
  keyword?: string;
  member?: string;        // 新增：按成员筛选
  members?: string[];     // 新增：按多个成员筛选
  groupByMember?: boolean; // 新增：是否按成员分组
}

// 响应扩展
[
  {
    location: string;
    count: number;
    totalAmount: number;
    firstDate: string;
    lastDate: string;
    member?: string;      // 如果 groupByMember=true，显示成员
    // 如果 groupByMember=false，显示所有成员的汇总
  }
]
```

**获取地址时间轴**：
```typescript
// 查询参数
{
  startDate?: string;
  endDate?: string;
  member?: string;        // 新增：按成员筛选
  members?: string[];     // 新增：按多个成员筛选
  includeExpenses?: boolean;
}

// 响应扩展
[
  {
    date: string;
    location: string;
    expenseCount: number;
    totalAmount: number;
    member?: string;      // 如果按成员筛选，显示成员
    members?: string[];   // 如果未按成员筛选，显示该地址涉及的所有成员
    expenses?: Array<{
      id: string;
      category: string;
      amount: number;
      description?: string;
      member?: string;    // 新增：显示每条支出的成员
    }>;
  }
]
```

**根据地址查询消费记录**：
```typescript
// 查询参数
{
  startDate?: string;
  endDate?: string;
  member?: string;        // 新增：按成员筛选
  members?: string[];     // 新增：按多个成员筛选
  page?: number;
  pageSize?: number;
}

// 响应扩展
{
  location: string;
  totalCount: number;
  totalAmount: number;
  members?: string[];     // 新增：该地址涉及的所有成员
  expenses: Array<{
    id: string;
    date: string;
    category: string;
    amount: number;
    description?: string;
    tags: string[];
    isExtra: boolean;
    member?: string;      // 新增：显示每条支出的成员
  }>;
}
```

#### 2.3.3 成员统计 API（新增）

**获取成员列表**：
```typescript
// 接口：GET /expenses/members
// 查询参数
{
  startDate?: string;
  endDate?: string;
}

// 响应
[
  {
    member: string;
    expenseCount: number;
    totalAmount: number;
    locationCount: number;  // 去过的地址数量
    firstDate: string;
    lastDate: string;
  }
]
```

**获取成员的地址统计**：
```typescript
// 接口：GET /expenses/members/:member/locations
// 查询参数
{
  startDate?: string;
  endDate?: string;
}

// 响应
{
  member: string;
  locations: [
    {
      location: string;
      count: number;
      totalAmount: number;
      firstDate: string;
      lastDate: string;
    }
  ]
}
```

### 2.4 默认地址逻辑扩展

#### 2.4.1 查询默认地址逻辑

当创建支出时，如果未提供 `location`，查询默认地址的逻辑：

1. **如果提供了 `member`**：
   - 优先查找指定 `member` 的默认地址
   - 如果找不到，查找未指定 `member` 的默认地址（适用于所有成员）
   
2. **如果未提供 `member`**：
   - 查找未指定 `member` 的默认地址（适用于所有成员）

#### 2.4.2 默认地址管理 API 扩展

**创建/更新默认地址**：
```typescript
{
  startDate: string;
  endDate?: string;
  location: string;
  member?: string;  // 新增：成员（可选）
}
```

**获取当前默认地址**：
```typescript
// 查询参数
{
  date?: string;
  member?: string;  // 新增：成员（可选）
}
```

## 3. 前端设计

### 3.1 支出表单扩展

在 `ExpenseForm.vue` 中添加成员选择：

**功能点**：
- 成员输入框（支持手动输入或下拉选择）
- 显示常用成员列表（基于历史记录）
- 成员输入支持自动完成

**UI 设计**：
- 成员输入框位于地址输入框下方
- 支持快速选择常用成员
- 显示当前成员的默认地址提示

### 3.2 地址统计页面扩展

**功能点**：
1. **成员筛选器**
   - 支持按成员筛选地址统计
   - 支持选择多个成员
   - 支持"全部成员"选项

2. **分组显示**
   - 支持按成员分组显示地址统计
   - 支持汇总显示（不分组）

3. **成员信息展示**
   - 在地址列表中显示成员信息
   - 支持点击成员查看该成员的地址统计

### 3.3 地址时间轴页面扩展

**功能点**：
1. **成员筛选**
   - 支持按成员筛选时间轴
   - 支持选择多个成员

2. **成员标识**
   - 在时间轴中显示每条记录的成员
   - 如果同一天同一地址有多个成员，分别显示

3. **成员统计**
   - 显示每个成员去过的地址数量
   - 显示每个成员的消费总额

### 3.4 成员管理页面（可选）

**新建页面**：`views/Members.vue`

**功能点**：
1. **成员列表**
   - 显示所有使用过的成员
   - 显示每个成员的统计信息（消费次数、总金额、地址数量）

2. **成员管理**
   - 添加常用成员（便于快速选择）
   - 编辑成员名称（统一管理）
   - 删除成员（清理不再使用的成员）

3. **成员详情**
   - 查看成员的消费记录
   - 查看成员的地址统计
   - 查看成员的时间轴

## 4. 统计场景示例

### 4.1 场景1：查看所有成员的地址统计

**需求**：查看家庭所有成员去过的所有地址

**实现**：
- 不设置 `member` 筛选
- `groupByMember=false`（或不设置）
- 返回所有地址的汇总统计

### 4.2 场景2：查看特定成员的地址统计

**需求**：查看爸爸去过的所有地址

**实现**：
- 设置 `member="爸爸"`
- 返回爸爸的所有地址统计

### 4.3 场景3：按成员分组查看地址统计

**需求**：查看每个成员去过的地址，按成员分组

**实现**：
- 设置 `groupByMember=true`
- 返回按成员分组的地址统计

### 4.4 场景4：查看特定地址的所有成员

**需求**：查看某个地址都有哪些成员去过

**实现**：
- 调用 `GET /expenses/locations/:location`
- 响应中的 `members` 字段包含所有成员列表

### 4.5 场景5：查看成员的时间轴

**需求**：查看爸爸的消费地址时间轴

**实现**：
- 调用 `GET /expenses/locations/timeline?member=爸爸`
- 返回爸爸的地址时间轴

## 5. 数据迁移

### 5.1 现有数据

- 现有支出记录的 `member` 字段为 `null` 或 `undefined`
- 不影响现有功能，向后兼容

### 5.2 可选的数据清理

如果需要统一成员名称，可以创建数据清理脚本：
- 识别相似的成员名称（如"爸爸"和"爸"）
- 提供合并建议
- 批量更新成员名称

## 6. 实施建议

### 6.1 第一阶段：基础支持

1. 在 Expense 模型中添加 `member` 字段
2. 扩展支出 API，支持 `member` 字段
3. 扩展地址统计 API，支持按成员筛选

### 6.2 第二阶段：前端支持

1. 在支出表单中添加成员输入
2. 在地址统计页面添加成员筛选
3. 在时间轴页面添加成员筛选

### 6.3 第三阶段：增强功能（可选）

1. 实现成员管理页面
2. 实现成员统计 API
3. 支持按成员设置默认地址

## 7. 注意事项

### 7.1 向后兼容

- `member` 字段是可选的，不影响现有功能
- 未设置 `member` 的记录按原有方式处理

### 7.2 数据一致性

- 成员名称是自由文本，可能出现拼写不一致
- 建议在前端提供常用成员列表，减少输入错误
- 可选：提供成员名称标准化功能

### 7.3 性能考虑

- 为 `member` 字段创建索引
- 按成员查询时使用索引优化

### 7.4 用户体验

- 成员输入支持自动完成（基于历史记录）
- 提供常用成员快速选择
- 在统计页面清晰显示成员信息

## 8. 未来扩展

如果未来需要更复杂的成员管理，可以考虑：

1. **创建 FamilyMember 模型**
   - 统一管理成员信息
   - 支持成员头像、备注等
   - Expense 关联到成员 ID

2. **成员权限管理**
   - 不同成员可以有不同的权限
   - 支持成员分组（如"父母"、"孩子"）

3. **成员消费预算**
   - 为每个成员设置消费预算
   - 按成员统计预算使用情况



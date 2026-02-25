# Issue → 实现 → 测试 → Code Review → PR 工作流配置说明

当您把 GitHub Issue 链接发给我时，我会按以下流程协助您：**理解 Issue → 实现功能/修 Bug → 用 Chrome DevTools MCP 做功能测试 → Code Review → 提交 PR**。  
您需要先完成下面这些配置，我才能顺利执行（尤其是创建 PR 和功能测试）。

---

## 一、您需要配置的内容概览

| 配置项 | 用途 | 是否已有 |
|--------|------|----------|
| GitHub CLI (`gh`) + 登录 | 在本地创建 PR、读取 Issue | 需您自行安装并登录 |
| 环境变量 `GH_TOKEN`（可选） | 无交互时用 token 创建 PR | 可选 |
| Chrome DevTools MCP 服务器（Cursor） | 功能测试（通过 MCP 控制浏览器） | 需在 Cursor 中配置 |
| Cursor 规则（已提供） | 让我按固定流程处理 Issue 链接 | 已写入 `.cursor/rules/issue-to-pr-workflow.mdc` |

---

## 二、详细配置步骤

### 1. 安装并登录 GitHub CLI（必须）

创建 PR、读取 Issue 都会用到 `gh`。

**安装（macOS）：**

```bash
brew install gh
```

**登录：**

```bash
gh auth login
```

按提示选择 GitHub.com → HTTPS → 用浏览器或 token 登录。  
登录成功后，在项目根目录执行：

```bash
gh auth status
```

确认为 `Logged in to github.com as <你的账号>` 即可。

**权限说明**：需要对当前仓库有 push 权限（通常就是 repo 的 owner 或 collaborator），这样我才能创建分支并执行 `gh pr create`。

---

### 2. 使用 Token 的方式（可选，适合无交互环境）

若您希望在不弹窗登录的情况下也能创建 PR（例如某些自动化环境），可配置 Personal Access Token：

1. GitHub → Settings → Developer settings → Personal access tokens → Generate new token (classic)。
2. 勾选权限：`repo`（完整仓库权限）、**`read:org`**（在 Admin: organizations 下，Read org and team membership）。缺少 `read:org` 时 `gh auth status` 会报错。
3. 复制生成的 token，在本地配置环境变量（不要提交到 Git）：

```bash
# 写入 ~/.zshrc 或 ~/.bashrc，仅本机使用
export GH_TOKEN="ghp_xxxxxxxxxxxxxxxxxxxx"
```

之后在终端执行 `gh auth status` 应显示已通过 token 登录。  
**注意**：Cursor 内运行的终端是否会继承该环境变量，取决于您如何启动 Cursor；若未继承，可在 Cursor 的终端里临时执行一次 `export GH_TOKEN=...` 再让我执行命令。

---

### 3. 配置 Chrome DevTools MCP（用于功能测试）

功能测试通过 **Chrome DevTools MCP** 完成：我会调用 MCP 工具（如 `navigate_page`、`click`、`fill`、`take_snapshot`、`list_console_messages` 等）控制 Chrome，对本地运行的应用做操作与验证。

**在 Cursor 中配置 MCP 服务器：**

1. 打开 **Cursor Settings** → **MCP** → **New MCP Server**。
2. 添加如下配置（或编辑已有 MCP 配置文件）：

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest"]
    }
  }
}
```

**环境要求：**

- Node.js v20.19 或更新。
- 已安装 Chrome 当前稳定版。
- 功能测试前，本地应用需已启动（例如在项目根目录执行 `pnpm dev`，或分别启动前端与后端），以便通过 MCP 打开 `http://localhost:5173`（或您的前端地址）进行验证。

配置并重启 Cursor 后，我即可在「实现」步骤之后使用 Chrome DevTools MCP 工具进行功能测试。  
**若您暂时不跑功能测试**：可说明「本次不跑功能测试」，我会跳过该步，仅做实现 + Code Review + 提交 PR。

---

### 4. Cursor 规则（已为您写好）

已在仓库中添加规则文件：

- **`.cursor/rules/issue-to-pr-workflow.mdc`**

当您**发送 GitHub Issue 链接**时，我会自动按照该规则执行：

1. 解析链接并获取 Issue 内容（通过 `gh issue view` 或读取网页）。
2. 根据 Issue 类型创建分支（如 `fix/issue-123` / `feat/issue-123`）。
3. 实现功能或修复 Bug。
4. 若已配置 Chrome DevTools MCP 且本地应用已启动，则使用 MCP 工具进行功能测试；否则跳过或按您约定。
5. 做一次 Code Review（检查实现是否贴合 Issue、是否有明显问题）。
6. 提交 commit，推送到 GitHub，并用 `gh pr create` 创建 PR，在 PR 描述中引用该 Issue。

您无需再额外配置 Cursor，只要在对话里粘贴 Issue 链接即可。

---

## 三、您这边需要做的检查清单

- [ ] 已安装 `gh` 并在本机执行过 `gh auth login`（或配置了 `GH_TOKEN`）。
- [ ] 在项目根目录执行 `gh auth status` 显示已登录，且对当前 repo 有 push 权限。
- [ ] （可选）已在 Cursor 中配置 Chrome DevTools MCP 服务器，功能测试前会先启动本地应用（如 `pnpm dev`）。
- [ ] 确认 `.cursor/rules/issue-to-pr-workflow.mdc` 存在且 Cursor 已加载规则（发一条带 Issue 链接的消息试一次即可验证）。

---

## 四、使用方式

配置完成后，您只需在对话里发送 Issue 链接，例如：

- `https://github.com/你的用户名/family-accounting-system/issues/123`
- 或：`请根据这个 issue 实现并提 PR：https://github.com/.../issues/456`

我会按「实现 → Chrome DevTools MCP 功能测试（若已配置 MCP 且应用已启动）→ Code Review → 提交 PR」的顺序执行，并在需要时向您确认或说明结果。

---

## 五、关于 GitHub 自动化发布

您提到项目已配置 GitHub 自动化发布（当前是 `main` 推送后构建、打 tag、部署到阿里云）。  
本工作流**不会改动**这部分逻辑：PR 是开在分支上的，只有合并到 `main` 后才会触发现有发布流程，因此无需为「Issue → PR」单独配置发布相关设置。

Chrome DevTools MCP 官方仓库与文档：[ChromeDevTools/chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp)。

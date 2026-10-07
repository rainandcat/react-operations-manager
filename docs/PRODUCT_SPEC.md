# Manager：公開作品規格（M0）

此檔定義之後要實作的範圍，不代表頁面或 mock API 已完成。功能以營運管理工作為靈感重新設計，不沿用任何既有系統的畫面、欄位名稱、資料或服務介面。

## 使用者與核心流程

虛構角色：`operator` 可查看摘要、客戶與活動；`reviewer` 額外可處理審查佇列。前端權限只用來展示 UI 流程，不能視為正式授權。

1. Demo 登入 → 進入 Dashboard → 查看待處理數與近期活動。
2. Customer Directory → 搜尋／狀態篩選／分頁 → 客戶詳情 → 返回時保留查詢條件。
3. Activity Records → 種類／狀態篩選 → 單筆詳情 → 查看對應客戶。
4. Review Queue → 查看虛構摘要 → 核准、要求補件或拒絕 → 確認 → 更新列表與回饋。

建議路由：`/login`、`/overview`、`/customers`、`/customers/:customerId`、`/activities`、`/activities/:activityId`、`/reviews`。這些是規格，不是目前已建立的路由。

## 模型與欄位

型別來源：`src/features/{auth,customers,activities,reviews,dashboard}/types.ts` 與 `src/services/apiTypes.ts`。

| 模型                          | 公開版必要欄位                                     | 限制                                             |
| ----------------------------- | -------------------------------------------------- | ------------------------------------------------ |
| Customer                      | 虛構 ID、顯示名稱、狀態、加入／最後活動時間        | 無 email、電話、地址、實名文件                   |
| Activity                      | 虛構 ID、客戶 ID、種類、狀態、金額字串、幣別、時間 | 不對接交易或金流；金額字串避免二進位浮點誤差     |
| ReviewCase                    | 虛構 ID、客戶 ID、狀態、摘要、提交／處理時間       | 不使用實際 KYC 文件或內部審查規則                |
| MockManagerSession            | 虛構操作員 ID、顯示名稱、展示用權限                | 不保存真實 token 或員工資料                      |
| ApiResponse / ApiRequestError | 資料、更新時間；錯誤碼、訊息、是否可重試           | 之後讓畫面能區分失敗類型，不假裝這是正式後端契約 |

日期以 ISO 8601 字串保存，UI 顯示時再格式化。TypeScript 型別不會在執行時驗證外部資料；之後若加入真實 API，須另做 runtime validation。

## Mock 資料規則

- 之後在本 repository 手寫固定 seed 的虛構資料與 mock service。ID 可用 `C-0001`、`A-0001`、`R-0001` 這類展示編號；不使用來源專案的資料改寫。
- Demo 啟動後應可重現：相同 seed 產生相同列表與計數；mutation 可在當次 session 內改變狀態，刷新後重置。
- Mock service 要能切換正常、延遲、空資料、錯誤與取消情境，並接受 `AbortSignal`；所有呼叫留在本機，不發出真實 API 請求。
- 不提交 `.env`、憑證、真實服務 URL、品牌圖像、聲音、內部文案或來源程式碼。

## M1–M3 驗收重點

- 未登入使用者無法進入 Manager 路由；登入／登出有明確畫面回饋。權限不足只展示 mock 行為。
- 列表查詢條件寫入 URL；重新整理或分享 URL 能還原搜尋、篩選、分頁。
- 每個非同步頁面都有 Loading、Error、Empty、Success 狀態；錯誤可重試，取消不呈現為一般錯誤。
- 審查操作有確認步驟、pending 防連點、成功後資料更新、失敗時原狀保留與可理解的錯誤訊息。
- 表單有 label、鍵盤可操作；對話框妥善處理焦點。主要流程以使用者行為測試驗證。

目前已完成的只有專案骨架、型別和本規格；上述流程需在後續里程碑實作與驗證。

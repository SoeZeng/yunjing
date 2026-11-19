export const outcomes = [
  { id: "account", text: "在一个云上开过虚拟机和私有存储，并且已经删干净。" },
  { id: "iam", text: "能解释最小权限，没有把管理员策略当默认。" },
  { id: "net", text: "能画出从名字解析到安全组再到进程的路径。" },
  { id: "tf", text: "用 Terraform 做过 plan、apply 和 destroy，state 不在 Git 里。" },
  { id: "script", text: "有一个失败时会非 0 退出的脚本，并通过 ShellCheck。" },
  { id: "k8s", text: "能说出 Pod、Deployment、Service 的差别，并用 kubectl 看过日志。" },
  { id: "pipe", text: "有一条会因为测试失败而变红的流水线。" },
  { id: "hand", text: "有四行 runbook 和一次按步骤完成的排障记录。" },
];

export const names = [
  { concept: "虚拟机", aws: "EC2", azure: "Virtual Machines", gcp: "Compute Engine" },
  { concept: "对象存储", aws: "S3", azure: "Blob Storage", gcp: "Cloud Storage" },
  { concept: "权限", aws: "IAM", azure: "Entra ID 与 RBAC", gcp: "IAM" },
  { concept: "私有网络", aws: "VPC", azure: "Virtual Network", gcp: "VPC" },
  { concept: "实例防火墙", aws: "Security Group", azure: "Network Security Group", gcp: "VPC 防火墙规则" },
  { concept: "基础设施代码", aws: "CloudFormation", azure: "Bicep / ARM", gcp: "可用 Terraform" },
  { concept: "托管 Kubernetes", aws: "EKS", azure: "AKS", gcp: "GKE" },
  { concept: "镜像仓库", aws: "ECR", azure: "Container Registry", gcp: "Artifact Registry" },
  { concept: "指标与日志", aws: "CloudWatch", azure: "Azure Monitor", gcp: "Cloud Monitoring" },
];

export const cases = [
  {
    id: "down",
    title: "网页打不开",
    first: "是所有人打不开，还是只有一条网络打不开？从哪一分钟开始？",
    checks: ["最近的发布、证书或安全组变更", "DNS 是否还指向预期地址", "进程或 Pod 是否还在运行", "安全组是否把端口关了或对错了来源"],
  },
  {
    id: "errors",
    title: "错误突然变多",
    first: "错误率上升之前，最近一次变更是什么？",
    checks: ["对照四个黄金信号里的错误和延迟", "查这一小段时间的日志，而不是全天日志", "如果刚发布过，准备按已知标签回滚", "确认不是告警阈值本身被改过"],
  },
  {
    id: "slow",
    title: "变得很慢",
    first: "慢发生在哪一层：名字解析、网络、应用，还是它依赖的下游？",
    checks: ["先看饱和度，不只看平均 CPU", "按 USE 逐项看 CPU、内存、磁盘和网络", "确认是所有请求都慢，还是只有某一条路径", "一次只移走一个怀疑对象"],
  },
  {
    id: "pipeline",
    title: "流水线变红",
    first: "红在测试、构建，还是连不上运行器？",
    checks: ["打开失败的那一个步骤，不要重跑十次碰运气", "分清代码失败和 Runner、权限、网络失败", "主分支在变绿之前不再叠加新变更", "把真正的失败信息留在拉取请求里"],
  },
  {
    id: "denied",
    title: "权限被拒绝",
    first: "被拒绝的是哪一个身份，想做的是哪一个动作？",
    checks: ["不要换成管理员重试", "看策略是挂在身份上还是资源上", "程序应该使用角色，而不是别人的长期密钥", "把缺少的那一条权限写进变更说明"],
  },
];

export const quiz = [
  {
    id: "state",
    prompt: "Terraform 的 state 文件丢了，下次 plan 最可能发生什么？",
    choices: [
      "工具仍然记得云上的一切，只是视图少一张表",
      "工具会以为配置里的资源还不存在，可能再创建一套",
      "云厂商会自动拒绝所有变更",
    ],
    answer: 1,
    explain: "state 保存配置名字和真实资源 ID 的对应。没有它，工具无法认出已经存在的资源。",
  },
  {
    id: "ssh",
    prompt: "安全组把管理端口对 0.0.0.0/0 放开，问题在哪？",
    choices: [
      "这样写可以让可用区之间互相通信",
      "全世界都能尝试连接这个管理入口",
      "这是私有子网的标准写法",
    ],
    answer: 1,
    explain: "0.0.0.0/0 表示任意来源。管理端口只应允许已知的地址或堡垒机。",
  },
  {
    id: "pod",
    prompt: "Deployment、Pod 和 Service 的关系，哪一句是对的？",
    choices: [
      "Service 负责保持副本数量，Pod 负责提供稳定域名",
      "Deployment 维持 Pod 数量，Service 提供稳定入口",
      "Pod 一旦创建，IP 和数量都永远不变",
    ],
    answer: 1,
    explain: "Deployment 管数量和更新，Service 管访问。Pod 可以被替换，所以不把入口绑在某一个 Pod IP 上。",
  },
  {
    id: "signals",
    prompt: "错误率上升时，第一份该看的材料是什么？",
    choices: [
      "先看这个时间窗的指标确认范围，再搜同一时间的日志",
      "先把 Elasticsearch 集群扩容",
      "先重装监控系统",
    ],
    answer: 0,
    explain: "指标回答“有多广、从何时开始”，日志回答“某一件具体的事”。先定范围，再查事件。",
  },
  {
    id: "red",
    prompt: "流水线因为测试失败变红，正确的下一步是？",
    choices: [
      "先合并，再在主分支上修",
      "拦住合并，先看失败的那一个步骤",
      "多点几次重跑，直到变绿",
    ],
    answer: 1,
    explain: "持续集成的价值就是挡住坏变更。重跑只在怀疑运行器抖动时有意义，而且要有证据。",
  },
  {
    id: "one",
    prompt: "排障时一次改了端口、镜像和权限，服务恢复了。这段记录的问题是？",
    choices: [
      "没有问题，恢复就够了",
      "无法知道是哪一个改动起了作用，下一次仍会盲改",
      "应该同时再重启一次物理机",
    ],
    answer: 1,
    explain: "一次只改一个变量，负结果也要留下。否则恢复不能变成知识。",
  },
];

export const glossary = [
  { term: "区域", def: "云厂商划分的地理区域。资源创建在某一个区域里，跨区域会有延迟和费用差异。" },
  { term: "可用区", def: "同一区域内相互隔离的一组机房。把副本放进不同可用区，是为了扛住单个机房故障。" },
  { term: "共享责任", def: "云厂商负责云平台本身，客户负责放进云里的数据、身份、网络规则和应用。" },
  { term: "最小权限", def: "身份只拥有完成当前任务所必需的权限，做完就收回临时权限。" },
  { term: "安全组", def: "挂在实例上的有状态防火墙。没有允许规则，流量就不能进入。" },
  { term: "声明式", def: "你描述期望的最终状态，由工具计算如何从现状走过去。相对的是逐步写点击或命令。" },
  { term: "state", def: "Terraform 用来记住真实资源 ID 的文件。它是映射，不是可选的日志。" },
  { term: "镜像", def: "应用及其运行环境的只读打包。用标签标识一次构建。" },
  { term: "容器", def: "镜像的一次运行。容器删除后，可写层里的修改默认消失。" },
  { term: "Pod", def: "Kubernetes 的调度单位，包含一个或多个共享网络的容器。" },
  { term: "Deployment", def: "声明要运行多少个 Pod，以及用哪一个镜像。失败和更新由它维持。" },
  { term: "Service", def: "为一组 Pod 提供稳定的访问名字。Pod 替换后，入口不必跟着变。" },
  { term: "流水线", def: "提交之后自动执行的一组步骤，通常包含测试、构建和发布。" },
  { term: "黄金信号", def: "延迟、流量、错误、饱和。用来判断用户感受到的服务质量。" },
  { term: "runbook", def: "值班时照着做的短说明。本月的格式是现象、影响、第一步、何时升级。" },
  { term: "退出码", def: "程序结束时交给调用者的数字。0 表示成功，非 0 表示失败。" },
];

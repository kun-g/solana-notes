# 设置开发环境 - 客户端 JavaScript

* 安装node.js
    * 方法1：去[nodejs官网](https://nodejs.org/en/)下载最新版nodejs安装
    * 方法2：用NVM安装
        * `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash`

* 安装solana-web3，参考[这里](https://github.com/solana-labs/solana-web3.js)
    * `npm install @solana/web3.js`

## Connection
Connection对象是与合约交互的核心，所有交互都要通过Connection对象完成。[API 文档](https://solana-labs.github.io/solana-web3.js/classes/connection.html)

```
let endpoint = 'https://api.devnet.solana.com'
let config = {
    commitment: 'finalized',
    disableRetryOnRateLimit: true
}
let conn = new Connection(endpoint, config)
```
通过接入不同的endpoint来接入不同的网络，比如本例就是接入devnet。
如果要接入主网，可以使用主网的接入点：'https://api.mainnet-beta.solana.com'

connectionConfig的commitment，指定了查询时，只返回指定状态的块/转账信息：
  * processed: 在接入的节点上完成了1次确认。
  * confirmed: 在集群完成了1次确认。
  * finalized: 在集群完成了足够的确认，被修改的可能性很低了。
  
一个转账的状态顺序是 processed -> confirmed -> finalized。
确认是说在这个区块之后，又出了几个区块，出的区块越多，数据被修改的可能性月底，的安全性越高。

接下来演示一下Connection的常用查询操作

## 查询余额
Connection的大部分方法是异步的，需要用Promise来获取返回的结果。

以下是查询钱包里SOL的余额的代码：
```JavaScript
;(async () => {
    let pubkey = new PublicKey('FbemVRsmZCtY6cHb3rwVXtypoe37vkbMWsGgzhJhhFQK')
    let balance = await conn.getBalance(pubkey)
    console.log("SOL:", balance)
})()
```

如果要查其它的Token的余额需要使用getTokenAccountsByOwner/getParsedTokenAccountsByOwner。这里涉及到Solana的Account方面的知识，暂时略过。


## 查询流通情况

conn提供了查询SOL和SPL Token流通量的接口：getSupply/getTokenSupply.
其中getSupply还有流通量和非流通量的数据：
```JavaScript
    console.log('SOL 流通情况：')
    var { value: { circulating, nonCirculating } } = await conn.getSupply()
    console.log(`流通中 ${circulating/1e9}\n非流通 ${nonCirculating/1e9}`)

    let SRM_mint = new PublicKey('SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt')
    let res = await conn.getTokenSupply(SRM_mint)
    console.log("Serum供应量", res.value.uiAmount)
```

有两个点值得注意：
1, 我在显示流通量数据时，除以了10e9。

这是因为SOL的精度是小数位9位，而链上的数据都是整数，所以显示时要做一下转换。

2, SRM的公钥这么一长串，非常的不友好，有没有更好的管理方法？

答案是有的，Solana社区维护了一个Token List，地址：

https://github.com/solana-labs/token-list

该数据库里有Solana链上主流Token的地址、精度和名称等信息。可以基于这些信息封装一个更友善的Token管理库。



代码地址：
https://github.com/kun-g/solana-notes

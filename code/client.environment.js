const { Connection, PublicKey, } = require('@solana/web3.js')
const { TOKEN_PROGRAM_ID } = require('../lib/constant')

;(async () => {
    let endpoint = 'https://api.mainnet-beta.solana.com'
    let config = {
        commitment: 'finalized',
        disableRetryOnRateLimit: true
    }
    let conn = new Connection(endpoint, config)
    let pubkey = new PublicKey('FbemVRsmZCtY6cHb3rwVXtypoe37vkbMWsGgzhJhhFQK')
    let balance = await conn.getBalance(pubkey)
    console.log("SOL:", balance)

    console.log('SOL 流通情况：')
    var { value: { circulating, nonCirculating } } = await conn.getSupply()
    console.log(`流通中 ${circulating/1e9}\n非流通 ${nonCirculating/1e9}`)

    let SRM_mint = new PublicKey('SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt')
    let res = await conn.getTokenSupply(SRM_mint)
    console.log("Serum供应量", res.value.uiAmount)

    pubkey = new PublicKey('9RFpLxiGvKfupJJiKyxfJa84aC14W9guiLhynexDgzEW')
    console.log(`Tokens for ${pubkey.toBase58()}`)
    let tokens = await conn.getParsedTokenAccountsByOwner(pubkey, {
        programId: TOKEN_PROGRAM_ID
    })
    for (let { account, pubkey } of tokens.value) {
        console.log(`Address: ${pubkey.toBase58()}, Amount: ${account.data.parsed.info.tokenAmount.uiAmount}`)
    }

})()

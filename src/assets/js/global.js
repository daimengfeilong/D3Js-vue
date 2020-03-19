global.api="/ngcos";


if(process.env.NODE_ENV == 'production'){

  //对公登记url
  global.public_URL = "http://ngfos.boyacx.com/#/otherToPublic"

}

//本地环境/测试环境
if(process.env.NODE_ENV == 'development' || process.env.srconfig == 'test' || process.env.srconfig == ''){

  //对公登记url
  global.public_URL = "http://ngfos-test.boyacx.com/#/otherToPublic"

}

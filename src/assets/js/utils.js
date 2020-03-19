/**
 * 路由权限过滤
 *
 * @param {*} routes //真实路由
 * @param {*} menuTree //权限路由
 */
export function filterRouter(routes,menuTree){

    routes.map(r1 => {
        menuTree.map(m1 => {
            /**
             * 一级目录
             * 码值：20400001-目录，20400002-页面，20400004-功能
             */
            if(r1.path == m1.url && m1.menuType == '20400001'){
                r1.meta.hidden = false
                r1.meta.title = m1.menuName

                //二级目录
                if(m1.childNodes && r1.children){
                    r1.children.map(r2 => {
                        m1.childNodes.map(m2 => {
                            if(r2.path == m2.url && m2.menuType == '20400002'){
                                r2.meta.hidden = false
                                r2.meta.title = m2.menuName
                                r2.meta.btnAuth = []

                                //保存按钮权限到路由
                                if(m2.childNodes){
                                    m2.childNodes.map(item => {
                                        r2.meta.btnAuth.push(item.menuCode);
                                    })
                                }

                                //三级目录
                                // if(m2.childNodes && r2.children){
                                //     r2.children.map(r3 => {
                                //         m2.childNodes.map(m3 => {
                                //             if(r3.path == m3.url && m3.menuType == '20400002'){
                                //                 r3.meta.hidden = false
                                //                 r3.meta.title = m3.menuName
                                //             }
                                //         })
                                //     })
                                // }

                            }
                        })
                    })
                }
            }
        })
    });

    return routes
}
/**
 * 获取按钮权限
 *
 * @param [*] btnAuth //真实路由
 * @param String item //权限路由
 */
export function getBtnAuth(btnAuth,item){
    if(!btnAuth) return false;

    for(let el of btnAuth){
        if(el == item){
            return true
        }
    }
    return false;
}
export function jsonToFormdata(sendJson){
  var fd = new FormData()
  for(var key in sendJson){
    fd.append(key, sendJson[key])
  }
  return fd
}
/**
 * 验证方法集合-基于element-ui
 */

//手机号码验证
export function checkPhone(rule,value,callback){
    let reg = /^1[3456789]\d{9}$/

    if (value === "") {
        callback(new Error("请输入手机号"))
    }else if(!reg.test(value)){
        callback(new Error("手机号码格式错误"))
    }else{
        callback()
    }
}
//价格-正整数
export function checkPrice(val){
    return /^[1-9]\d*$/.test(val)
}
//固定电话
export function checkTel(val){
    return /^\d{7,14}$/.test(val)
}
//中文姓名
export function checkName(rule,value,callback){
	let reg = /^([a-zA-Z\u4e00-\u9fa5\·]{1,13})$/

    if (value === "") {
        callback(new Error("请输入真实姓名"))
    }else if(!reg.test(value)){
        callback(new Error("真实姓名格式错误"))
    }else{
        callback()
    }
//  return /^([a-zA-Z\u4e00-\u9fa5\·]{1,20})$/.test(val)
//  return /^[a-zA-Z\u4E00-\u9FA5\uf900-\ufa2d·s]{1,20}$/.test(val)
     
}
//身份证号
export function idCard(val){
    return /^(\d{15}$)|(^\d{17}([0-9]|X))$/.test(val)
}

//系统权限-用户-用户名
export function userId(rule,value,callback){
    let reg = /^[\w]{4,30}$/
    
    if (value === "") {
        callback(new Error("请输入用户名"))
    }else if(!reg.test(value)){
        callback(new Error("用户名格式错误"))
    }else{
        callback()
    }
}
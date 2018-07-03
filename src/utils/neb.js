import { Neb, HttpRequest } from 'nebulas';
import NebPay from 'nebpay';
import Config from '../config/config';
import { Toast } from 'antd-mobile';
const myNebPay = new NebPay();
const myNeb = new Neb();
myNeb.setRequest(new HttpRequest(Config.nebHttp));
// myNeb.setRequest(new HttpRequest("http://localhost:8685"));

const contactAddr = Config.contarctAddr;
const addr = localStorage.getItem('address') || contactAddr
const options = {
	qrcode: {
		showQRCode: false,      //是否显示二维码信息
		container: undefined,    //指定显示二维码的canvas容器，不指定则生成一个默认canvas
		completeTip: undefined, // 完成支付提示
		cancelTip: undefined // 取消支付提示
	},
	extension: {
		openExtension: true //是否支持插件调用
	},
	mobile: {
		showInstallTip: true, //是否支持手机钱包安装提示
		installTip: undefined // 手机钱包安装提示
	},

	// callback 是记录交易返回信息的交易查询服务器地址，
	// 目前我们提供了主网和测试网交易查询服务器, 查询频率不能超过20次/分钟
	//callback: NebPay.config.mainnetUrl,     //主网(默认为主网,可不写)
	// callback: NebPay.config.testnetUrl, //测试网

	// listener: 指定一个listener函数来处理交易返回信息（仅用于浏览器插件，App钱包不支持listener）
	listener: undefined,
	// if use nrc20pay ,should input nrc20 params like name, address, symbol, decimals
	nrc20: undefined,

	// 是否为测试模式，在测试模式下，将打开测试版Nano钱包和切换请求连接
	debug: false
};

const callOptions = {
	chainID: 1,
	from: addr,
	to: contactAddr,
	value: '0',
	nonce: 12,
	gasPrice: '1000000',
	gasLimit: '2000000'
}

//定义listener函数作为返回信息的回调
const listenerFunction = (serialNumber,result) => {
	// console.log(`the transaction result for ${serialNumber} is: ` + JSON.stringify(result))
	Toast.info(JSON.stringify(result), 2, null, false)
}

const funcIntervalQuery = (intervalQuery, serialNumber) => {
	//queryPayInfo的options参数用来指定查询交易的服务器地址,(如果是主网可以忽略,因为默认服务器是在主网查询)
	myNebPay.queryPayInfo(serialNumber, options)   //search transaction result from server (result upload to server by app)
	.then(function (resp) {
		console.log("tx result: " + resp)   //resp is a JSON string
		var respObject = JSON.parse(resp)
		//code==0交易发送成功, status==1交易已被打包上链
		if(respObject.code === 0 && respObject.data.status === 1){
			//交易成功,处理后续任务....
			Toast.hide()
			clearInterval(intervalQuery)    //清除定时查询
		}
	})
	.catch(function (err) {
		Toast.info(err, 2, null, false)
	});
}

export {
  myNebPay,
  options,
	contactAddr,
	myNeb,
	callOptions,
	listenerFunction,
	funcIntervalQuery
}
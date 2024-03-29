import { IFuncOrigin, IFuncOperatorOrigin, IFuncOperator, } from '@/interface/IFunc';
import { Script } from '@/system/script';
// const normal = -1; //定义常量
const left = 0;
const center = 1;
const right = 2;
export class Func518 implements IFuncOrigin {
	id = 322;
	name = '寮捐勾玉';
	desc = '领取勾玉卡并且捐给寮勾玉(用于小号)';
	operator: IFuncOperatorOrigin[] = [{ // 0 庭院
		desc: '页面是否为庭院_菜单未展开_只支持默认庭院皮肤与默认装饰',
		oper: [
			[right, 1280, 720, 1168, 592, 1230, 690, 1000]
		]
	}, { // 1 进入阴阳寮
		desc: '页面是否为庭院_菜单已展开_只支持默认庭院皮肤与默认装饰',
		oper: [
			[center, 1280, 720, 544, 612, 594, 661, 1200]	// 点击阴阳寮
		]
	}, { // 2 寮信息
		desc: [
			1280, 720,
			[
				[right, 1174, 635, 0x877769],
				[right, 1226, 613, 0xdf5252],
				[right, 1216, 631, 0xfffdf9],
				[right, 1184, 671, 0x901c1c],
				[right, 1212, 664, 0xebe4db],
			]
		],
		oper: [
			[center, 1280, 720, 1170, 620, 1232, 674, 1000],
		]
	}, { // 3 寮捐勾
		desc: [
			1280, 720,
			[
				[left, 143, 82, 0xb6805e],
				[left, 259, 80, 0x8c5f43],
				[right, 1195, 170, 0xd37f4a],
				[center, 950, 635, 0x8a2e2e],
				[right, 1109, 633, 0x518db7],
			]
		],
		oper: [
			[center, 1280, 720, 273, 496, 290, 517, 1000],
		]
	}, { // 4 勾上限并捐
		desc: [
			1280, 720,
			[
				[center, 822, 382, 0xf17f37],
				[center, 822, 398, 0xf18037],
				[center, 845, 378, 0x6b462c],
				[center, 846, 400, 0x5c3922],
				[center, 458, 302, 0xeacc9b],
				[center, 807, 300, 0xedd1a7],
			]
		],
		oper: [
			[center, 1280, 720, 564, 520, 714, 569, 300],
		]
	}, { // 5 增加勾玉数量
		desc: [
			1280, 720,
			[
				[center, 399, 128, 0x684636],
				[center, 883, 129, 0x694737],
				[center, 460, 301, 0xeed3a9],
				[center, 609, 463, 0x9e6d60],
				[center, 737, 461, 0xad7a46],
				[center, 809, 304, 0xedcfa1],
			]
		],
		oper: [
			[center, 1280, 720, 788, 285, 831, 322, 1000],
		]
	}, { // 6 获得奖励
		desc: [1280, 720,
			[
				[center, 424, 328, 0xbfa88f],
				[center, 408, 237, 0x382a1c],
				[center, 854, 241, 0x382a1c],
				[center, 669, 242, 0xe6d79c],
				[center, 869, 327, 0xb79e86],
				[center, 926, 386, 0x825e34],
				[center, 371, 395, 0x8b673e]
			]
		],
		oper: [
			[left, 1280, 720, 24, 7, 71, 50, 500],
			[left, 1280, 720, 24, 7, 71, 50, 500],
			[left, 1280, 720, 24, 7, 71, 50, 500],
		]
	}, { // 7 勾玉不足
		desc: [
			1280, 720,
			[
				[center, 577, 224, 0x3e3730],
				[center, 577, 254, 0x3e3730],
				[center, 626, 239, 0xebeaea],
				[center, 679, 241, 0xdbd9d8],
				[center, 712, 229, 0x3e3730],
				[center, 717, 246, 0x3e3730],
			]
		],
		oper: [
			[center, 1280, 720, 444, 287, 482, 321, 1000],
			[center, 1280, 720, 566, 523, 714, 565, 400],
		]
	}, { // 8 0次捐赠
		desc: [
			1280, 720,
			[
				[center, 418, 392, 0xa17c2b],
				[center, 429, 367, 0xddc644],
				[center, 436, 370, 0xdabe38],
				[center, 437, 409, 0xa17d2a],
				[center, 428, 386, 0x623e27],
				[center, 620, 323, 0xa72d02],
				[center, 631, 322, 0xad431b],
			]
		],
		oper: [
			[center, 1280, 720, 90, 314, 336, 458, 500],
			[left, 1280, 720, 24, 7, 71, 50, 500],
			[left, 1280, 720, 24, 7, 71, 50, 500],
		]
	}
	];
	operatorFunc(thisScript: Script, thisOperator: IFuncOperator[]): boolean {
		if (thisScript.oper({
			name: '捐勾完成',
			operator: [thisOperator[6], thisOperator[8]]
		})) {
			thisScript.global.juan_gouyu = false;
			return true;
		}
		if (thisScript.oper({
			name: '勾玉不足',
			operator: [thisOperator[7]]
		})) {
			return true;
		}
		if (thisScript.oper({
			name: '找体力_进寮信息',
			operator: [{ desc: thisOperator[2].desc }]
		})) {
			sleep(1500);
			thisScript.keepScreen();
			const point = thisScript.findMultiColor('阴阳寮_奖励体力');
			if (point) {
				console.log('查找阴阳寮_奖励体力成功');
				const oper = [[
					point.x,
					point.y,
					point.x,
					point.y,
					1000
				]];
				thisScript.regionClick(oper);
				thisScript.regionClick([thisOperator[6].oper[0]]);
				return true;
			}
		}
		if (thisScript.global.juan_gouyu && thisScript.oper({
			name: '捐勾杂项',
			operator: [thisOperator[0], thisOperator[1], thisOperator[2]
				, thisOperator[4], thisOperator[5]]
		})) {
			return true;
		}
		let curCnt = 0;
		const maxCount = 3;
		while (thisScript.oper({
			id: 322,
			name: '点击寮捐勾',
			operator: [thisOperator[3]]
		}, 0)) {
			curCnt++;
			thisScript.keepScreen(false);
			if (curCnt >= maxCount) {
				thisScript.myToast('已达上限');
				thisScript.regionClick([thisOperator[6].oper[0]]);
				thisScript.regionClick([thisOperator[6].oper[0]]);
				thisScript.global.juan_gouyu = false;
				sleep(1000);
				return true;
			}
		}
	}
}
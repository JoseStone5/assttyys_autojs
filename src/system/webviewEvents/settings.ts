import { webview } from "@/system";
import drawFloaty from '@/system/drawFloaty';
import myFloaty from '@/system/MyFloaty';
import { storeCommon } from '@/system/store';
import { getInstalledPackages, requestMyScreenCapture } from '@/common/toolAuto';
import { isRoot } from "@auto.pro/core";
import helperBridge from '@/system/helperBridge';
import { mlkitOcr } from '@/system/Ocr/MlkitOcr';
import { yunxiOcr } from "@/system/Ocr/YunxiOcr";
import { myShell } from "@/system/MyAutomator";


export default function webviewSettigns() {

    /** 初始化配置 */
    let initStoreSettings = storeCommon.get('settings', {});
    if (typeof initStoreSettings.tapType === 'undefined') {
        if (device.sdkInt >= 24) {
            initStoreSettings.tapType = '无障碍';
        } else {
            initStoreSettings.tapType = 'Root';
        }
    }

    if (typeof initStoreSettings.ocrType === 'undefined') {
        initStoreSettings.ocrType = 'MlkitOcr';
    }

    if (typeof initStoreSettings.floaty_scheme_direct_run === 'undefined') {
        initStoreSettings.floaty_scheme_direct_run = false;
    }

    if (typeof initStoreSettings.osp_user_token === 'undefined') {
        initStoreSettings.osp_user_token = '';
    }

    if (typeof initStoreSettings.push_type === 'undefined') {
        initStoreSettings.push_type = '关闭推送';
    }

    if (typeof initStoreSettings.oneBot_version === 'undefined') {
        initStoreSettings.oneBot_version = '12';
    }

    if (typeof initStoreSettings.msgPush_prefix === 'undefined') {
        initStoreSettings.msgPush_prefix = '[ASSTTYYS]';
    }

    storeCommon.put('settings', initStoreSettings);

    // 获取配置列表
    webview.on("getSettings").subscribe(([_param, done]) => {
        let storeSettings = storeCommon.get('settings', {});

        let ret = [];
        ret.push({
            desc: '点击/滑动模式',
            name: 'tapType',
            type: 'assttyys_setting',
            stype: 'list',
            data: ['无障碍', 'Root', 'Shell', 'RootAutomator'],
            value: storeSettings.tapType
        });
        if (device.sdkInt >= 24) { // 无障碍
            ret.push({
                desc: '无障碍服务(仅使用无障碍模式时生效)',
                name: 'autoService',
                type: 'autojs_inner_setting_auto_service',
                enabled: !!auto.service
            });
        }
        if (app.autojs.versionCode >= 8081200) {
            ret.push({
                desc: '截图权限',
                name: 'screenCapturePermission',
                type: 'autojs_inner_settings_capture_permission',
                // @ts-ignore
                enabled: !!images.getScreenCaptureOptions()
            });
        }
        ret = [...ret, {
            desc: '悬浮窗权限',
            name: 'floatyPerminssion',
            type: 'autojs_inner_setting_floaty_permission',
            enabled: floaty.checkPermission()
        }, {
            desc: '音量上键停脚本及程序',
            name: 'stop_all_on_volume_up',
            type: 'autojs_inner_setting',
            enabled: $settings.isEnabled('stop_all_on_volume_up')
        }, {
            desc: '前台服务',
            name: 'foreground_service',
            type: 'autojs_inner_setting',
            enabled: $settings.isEnabled('foreground_service')
        }
            // , {
            //     desc: '开机自启',
            //     name: 'launch_after_boot',
            //     type: 'assttyys_setting_launch_after_boot',
            //     //@ts-ignore
            //     enabled: !!$work_manager.queryIntentTasks({
            //         action: 'android.intent.action.BOOT_COMPLETED'
            //     }).length,
            // }
        ];

        if (device.sdkInt >= 23) {
            ret.push({
                desc: '忽略电池优化',
                name: 'ignoreBatteryOptimization',
                type: 'autojs_inner_setting_power_manage',
                enabled: $power_manager.isIgnoringBatteryOptimizations()
            });
        }

        if (device.sdkInt >= 31 && isRoot) { // 安卓12，有root
            // 不受信任触摸事件
            const unTrunstedTouchStatus = myShell.execAndWaitFor('settings get global block_untrusted_touches');
            if (typeof unTrunstedTouchStatus !== 'undefined') {
                console.log('unTrunstedTouchStatus', unTrunstedTouchStatus);
                ret.push({
                    desc: '允许不受信任触摸的事件穿透',
                    name: 'unTrunstedTouchStatus',
                    type: 'autojs_inner_setting_unTrunstedTouchStatus',
                    enabled: 0 === parseInt(unTrunstedTouchStatus) ? true : false
                });
            }
        }

        ret = [...ret, {
            desc: '悬浮选择方案后是否直接启动脚本',
            name: 'floaty_scheme_direct_run',
            type: 'assttyys_setting',
            enabled: storeSettings.floaty_scheme_direct_run
        }, {
            desc: '调试绘制',
            name: 'floaty_debugger_draw',
            type: 'assttyys_setting_floaty_debugger_draw',
            enabled: !!drawFloaty.instacne
        }, {
            desc: 'OCR扩展类型',
            name: 'ocrType',
            type: 'assttyys_setting',
            stype: 'list',
            data: ['MlkitOcr', 'YunxiOcr'],
            value: storeSettings.ocrType
        }, {
            desc: 'OCR扩展',
            name: 'ocr_extend',
            type: 'assttyys_setting_ocr_extend',
            enabled: storeSettings.ocrType === 'MlkitOcr' ? mlkitOcr.isInstalled() : yunxiOcr.isInstalled()
        }, {
            desc: '消息推送方式',
            name: 'push_type',
            type: 'assttyys_setting',
            stype: 'list',
            data: ['关闭推送', 'Gotify', 'pushplus', 'ospPush', 'oneBot'],
            value: storeSettings.push_type
        }];
        if (storeSettings.push_type === 'oneBot') {
            ret.push({
                desc: 'oneBot版本',
                name: 'oneBot_version',
                type: 'assttyys_setting',
                stype: 'list',
                data: ['11', '12'],
                value: storeSettings.oneBot_version
            }, {
                desc: '推送地址',
                name: 'oneBot_url',
                type: 'assttyys_setting',
                stype: 'text',
                value: storeSettings.oneBot_url
            }, {
                desc: '推送内容前缀',
                name: 'msgPush_prefix',
                type: 'assttyys_setting',
                stype: 'text',
                value: storeSettings.msgPush_prefix
            });
        } else if (storeSettings.push_type === 'ospPush') {
            ret.push({
                desc: 'ospUserToken(因作者bot寄了，请自行部署OneBot使用)',
                name: 'osp_user_token',
                type: 'assttyys_setting',
                stype: 'text',
                value: storeSettings.osp_user_token
            }, {
                desc: '推送内容前缀',
                name: 'msgPush_prefix',
                type: 'assttyys_setting',
                stype: 'text',
                value: storeSettings.msgPush_prefix
            })
        } else if (storeSettings.push_type === 'Gotify') {
            ret.push({
                desc: 'gotify的token',
                name: 'gotify_user_token',
                type: 'assttyys_setting',
                stype: 'text',
                value: storeSettings.gotify_user_token
            }, {
                desc: '推送内容前缀',
                name: 'msgPush_prefix',
                type: 'assttyys_setting',
                stype: 'text',
                value: storeSettings.msgPush_prefix
            }, {
                desc: '推送地址',
                name: 'gotify_url',
                type: 'assttyys_setting',
                stype: 'text',
                value: storeSettings.gotify_url
            })
        } else if (storeSettings.push_type === 'pushplus') {
            ret.push({
                desc: 'token',
                name: 'pushplus_token',
                type: 'assttyys_setting',
                stype: 'text',
                value: storeSettings.pushplus_token
            }, {
                desc: '推送内容前缀',
                name: 'msgPush_prefix',
                type: 'assttyys_setting',
                stype: 'text',
                value: storeSettings.msgPush_prefix
            })
        }
        done(ret);
    });

    // 保存配置
    webview.on("saveSetting").subscribe(([item, done]) => {
        if ('autojs_inner_setting' === item.type) {
            $settings.setEnabled(item.name, item.enabled);
            done(true);
        } else if ('autojs_inner_setting_power_manage' === item.type) { // 忽略电池优化
            if (item.enabled) {
                $power_manager.requestIgnoreBatteryOptimizations();
                done(true);
            } else {
                toastLog('已忽略电池优化请勿取消');
                done(false);
            }
        } else if ('autojs_inner_setting_auto_service' === item.type) { // 无障碍
            if (item.enabled) {
                // 启用无障碍服务
                if (isRoot) {
                    $settings.setEnabled('enable_accessibility_service_by_root', true);
                } else {
                    $settings.setEnabled('enable_accessibility_service_by_root', false);
                    toastLog('在回到程序前请手动开启无障碍服务');
                }
                threads.start(function () {
                    auto.waitFor();
                    // if (floaty.checkPermission()) {
                    //     myFloaty.init();
                    // }
                    done(true);
                });
            } else {
                auto.service && auto.service.disableSelf();
                done(true);
            }
        } else if ('autojs_inner_setting_floaty_permission' === item.type) {
            if (item.enabled) {
                toastLog('在回到程序前请手动开启悬浮窗权限');
                floaty.requestPermission();
                let count = 0;
                let timmer = setInterval(function () {
                    count++;
                    if (count > 20) {
                        clearInterval(timmer);
                        done(false);
                    }
                    if (floaty.checkPermission()) {
                        clearInterval(timmer);
                        myFloaty.init();
                        done(true);
                    }
                }, 1000)
            } else {
                toastLog('请勿关闭悬浮权限');
                done(false);
            }
        } else if ('autojs_inner_settings_capture_permission' === item.type) {
            if (item.enabled) {
                requestMyScreenCapture(function (res) {
                    done(res)
                }, helperBridge);
            } else {
                toastLog('请勿关闭截图权限');
                done(false);
                // threads.start(function () {
                //     images.stopScreenCapture();
                //     done(true);
                // });
            }
        } else if ('autojs_inner_setting_unTrunstedTouchStatus' === item.type) {
            if (item.enabled) {
                myShell.execAndWaitFor('settings put global block_untrusted_touches 0');
                done(true);
            } else {
                toastLog('请勿关闭允许不受信任触摸的事件穿透');
                done(false);
            }
        } else if ('assttyys_setting' === item.type) {
            let storeSettings = storeCommon.get('settings', {});
            if ((item.stype || 'switch') === 'switch') {
                storeSettings[item.name] = item.enabled;
            } else if (item.stype === 'text') {
                storeSettings[item.name] = item.value;
            } else if (item.stype === 'list') {
                storeSettings[item.name] = item.value;
            }
            if (item.name === 'tapType') {
                helperBridge.automator.setTapType(item.value);
            }
            storeCommon.put('settings', storeSettings);
            done(true);
            console.log(storeSettings);
            toastLog('保存成功');
        } else if ('assttyys_setting_floaty_debugger_draw' === item.type) {
            if (item.enabled) {
                drawFloaty.init();
            } else {
                drawFloaty.destroy();
            }
            console.log(drawFloaty);
            done(true);
        } else if ('assttyys_setting_ocr_extend' === item.type) {
            let storeSettings = storeCommon.get('settings', {});
            if (item.enabled) {
                let ocr = null;
                if (storeSettings.ocrType === 'MlkitOcr') {
                    ocr = mlkitOcr;
                } else if (storeSettings.ocrType === 'YunxiOcr') {
                    ocr = yunxiOcr;
                }
                ocr.install({
                    successCallback: function () {
                        done(true)
                    },
                    failCallback: function () {
                        done(false)
                    },
                });
            } else {
                // done(true);
                // todo 卸载扩展
                toastLog('已安装扩展请勿取消');
                done(false);
            }
        } else if ('assttyys_setting_launch_after_boot' === item.type) {
            if (item.enabled) {
                //@ts-ignore
                $work_manager.addIntentTask({
                    path: context.getFilesDir().getAbsolutePath() + '/project/main.js',
                    action: 'android.intent.action.BOOT_COMPLETED'
                });
                //@ts-ignore
                const tasks = $work_manager.queryIntentTasks({
                    action: 'android.intent.action.BOOT_COMPLETED'
                });
                console.log(tasks);
                if (tasks.length > 0) {
                    done(true);
                } else {
                    done(false);
                }
            } else {
                //@ts-ignore
                const tasks = $work_manager.queryIntentTasks({
                    action: 'android.intent.action.BOOT_COMPLETED'
                });
                tasks.forEach(task => {
                    console.log("删除: ", task);
                    //@ts-ignore
                    log($work_manager.removeIntentTask(task.id));
                });
                done(true);
            }
        }
    });

    // 打开日志
    webview.on("startActivityForLog").subscribe(([_param, done]) => {
        app.startActivity("console");
        done();
    });

    // 清空storage
    webview.on("clearStorage").subscribe(([_param, done]) => {
        storages.remove('asttyys_ng');
        done();
    });

    // 获取所有应用列表
    webview.on('getToSetDefaultLaunchAppList').subscribe(([_param, done]) => {
        let storeSettings = storeCommon.get('settings', {});
        let defaultLaunchAppList = storeSettings.defaultLaunchAppList || [];
        let packageList = getInstalledPackages();
        // done([]);
        let appList = packageList.filter(packageInfo => {
            // 保留非系统应用
            return (packageInfo.applicationInfo.flags & android.content.pm.ApplicationInfo.FLAG_SYSTEM) === 0;
        }).map(packageInfo => {
            return {
                appName: packageInfo.applicationInfo.label,
                packageName: packageInfo.packageName, // 获取应用包名，可用于卸载和启动应用
                versionName: packageInfo.versionName, // 获取应用版本名
                versionCode: packageInfo.versionCode, // 获取应用版本号
                referred: defaultLaunchAppList.indexOf(packageInfo.packageName) !== -1,
            }
        });
        done(appList);
    });

    webview.on('getIconByPackageName').subscribe(([packageName, done]) => {
        let packageList = getInstalledPackages().filter(packageInfo => packageInfo.packageName === packageName);
        if (packageList.length === 0) {
            done(null);
            return;
        }
        let packageInfo = packageList[0];
        let bmp = null;
        try {
            let appIcon = packageInfo.applicationInfo.loadIcon(context.getPackageManager());
            if (appIcon.getBitmap) {
                bmp = appIcon.getBitmap();
            } else if (appIcon.getBackground && appIcon.getForeground) {
                bmp = android.graphics.Bitmap.createBitmap(appIcon.getIntrinsicWidth(), appIcon.getIntrinsicHeight(), android.graphics.Bitmap.Config.ARGB_8888);
                let canvas = new android.graphics.Canvas(bmp);
                appIcon.setBounds(0, 0, canvas.getWidth(), canvas.getHeight());
                appIcon.draw(canvas);
            }
            if (!bmp) {
                done(null);
                return;
            }
            let baos = new java.io.ByteArrayOutputStream();
            bmp.compress(android.graphics.Bitmap.CompressFormat.PNG, 100, baos);
            baos.flush();
            baos.close();
            const str = 'data:image/png;base64,' + android.util.Base64.encodeToString(baos.toByteArray(), android.util.Base64.NO_WRAP);
            done(str);
            // bmp.recycle();
        } catch (e) {
            console.error(e);
            done(null);
            bmp && bmp.recycle();
        }
    });

    // 保存默认启动应用，在功能列表界面点击启动后直接启动已配置的应用
    webview.on('saveToSetDefaultLaunchAppList').subscribe(([packageNameList, done]) => {
        let storeSettings = storeCommon.get('settings', {});
        storeSettings.defaultLaunchAppList = packageNameList;
        storeCommon.put('settings', storeSettings);
        done(true);
    });

    // 获取异型屏兼容强化配置
    webview.on('getShapedScreenConfig').subscribe(([_param, done]) => {
        let shapedScreenDevices = ['xiaomi 11(3200*1440)'];
        let storedShapedScreenConfig = storeCommon.get('shapedScreenConfig', []);
        let ret = [];
        shapedScreenDevices.forEach(deviceName => {
            let enabled = false;
            for (let i = 0; i < storedShapedScreenConfig.length; i++) {
                if (storedShapedScreenConfig[i] === deviceName) {
                    enabled = true;
                    break;
                }
            }
            ret.push({
                device: deviceName,
                enabled
            });
        });
        console.log(ret);
        done(ret);
    });

    // 保存异型屏兼容强化配置
    webview.on('setShapedScreenConfigEnabled').subscribe(([deviceParam, done]) => {
        let storedShapedScreenConfig = storeCommon.get('shapedScreenConfig', []);
        let indx = storedShapedScreenConfig.indexOf(deviceParam.device);
        if (indx === -1) {
            if (deviceParam.enabled) {
                storedShapedScreenConfig.push(deviceParam.device);
            }
        } else {
            if (!deviceParam.enabled) {
                storedShapedScreenConfig.splice(indx, 1);
            }
        }
        storeCommon.put('shapedScreenConfig', storedShapedScreenConfig);
        console.log('storedShapedScreenConfig:' + JSON.stringify(storedShapedScreenConfig));
        done();
    });
}

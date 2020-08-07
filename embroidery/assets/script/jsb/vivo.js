import nativeAdItemModel from './nativeAdItemModel';

const vivoConfig = {
    AppId: "100006090",
    OpenScreenId: "sss",
    BannerId: "535256ace6f04174937ab9581e611eee",
    RewardedVideoId: "1222604dfa8240b08ce86995b4ed057a",
    InsertId: "22251c74ecf443b592c1bca3251adaa5",
    NativeId: "c9ed79e9ddf34913a1ea24724a03118f",

    ErrZCount: 3,
    BannerErrCount: 0,
    VoideErrCount: 0,
    InsertErrCount: 0,

    //谨慎修改
    rewardVideoLoadOverPlay: false,
    isCachedInsertLoadOverPlay: false,
}

const vivo = {

    bannerAd: "",

    videoAd: "",
    rewardVideoCall: "",
    isCachedVideo: false,

    insertAd: "",
    isCachedInsert: false,

    nativeAd: "",
    native_ad_list: [],

    init() {
        
    },
    //***********************banner*******************
    loadBannerView() {
        if (vivoConfig.BannerErrCount >= vivoConfig.ErrZCount) {
            console.log("加载超时-----banner");
            return
        }

        if (!this.bannerAd) {
            //不设置style默认在顶部显示，布局起始位置为屏幕左上角
            let bannerAd = this.bannerAd = qg.createBannerAd({
                posId: vivoConfig.BannerId,
                style: {}
            });

            bannerAd.onLoad(() => {
                console.log('Banner广告加载成功');
                vivoConfig.BannerErrCount = 0;
                this.showBanner();
            });

            bannerAd.onError((err) => {
                switch (err.code) {
                    case 30003:
                        console.log("新用户1天内不能曝光Banner，请将手机时间调整为1天后，退出游戏重新进入")
                        break;
                    case 30009:
                        console.log("10秒内调用广告次数超过1次，10秒后再调用")
                        break;
                    case 30002:
                        console.log("加载广告失败，重新加载广告")
                        break;
                    default:
                        console.log("banner广告展示失败")
                        console.log(JSON.stringify(err))
                        break;
                }
                vivoConfig.BannerErrCount++;
            });

            bannerAd.onClose(() => {
                console.log("bannerAd 关闭");
                setTimeout(() => {
                    this.showBanner();
                }, 60000);
            });
        }
    },

    showBanner() {
        if (this.bannerAd) {
            var adshow = this.bannerAd.show();
            adshow && adshow.then(() => {
                console.log("banner广告展示成功");
            }).catch(err => {
                console.log("banner广告展示失败", JSON.stringify(err));
            });
        } else {
            this.loadBannerView();
        }
    },

    hideBannder() {
        if (this.bannerAd) {
            var addestroy = this.bannerAd.destroy();
            addestroy && addestroy.then(() => {
                console.log("banner广告销毁成功");
            }).catch(err => {
                console.log("banner广告销毁失败", err);
            });
            this.bannerAd = null;
        }
    },

    //******************激励视频*******************/
    loadRewardVideo() {
        if (qg.createRewardedVideoAd == null) return;
        if (vivoConfig.VoideErrCount >= vivoConfig.ErrZCount) {
            console.log("加载超时-----video");
            return;
        }
        if (!this.videoAd) {
            let videoAd = qg.createRewardedVideoAd({ posId: vivoConfig.RewardedVideoId });
            videoAd.onLoad(() => {
                console.log('激励视频加载成功');
                this.isCachedVideo = true;
                vivoConfig.VoideErrCount = 0;
                if (vivoConfig.rewardVideoLoadOverPlay) {
                    this.showRewardVideo();
                }
            });
            videoAd.onError((err) => {
                console.log("激励视频播放失败" + JSON.stringify(err));
                vivoConfig.VoideErrCount++;
                setTimeout(() => {
                    this.loadRewardVideo();
                }, 1000 * 60);
            });

            videoAd.onClose((res) => {
                if (res && res.isEnded) {
                    console.log("正常播放结束，可以下发游戏奖励");
                    this.rewardVideoCall && this.rewardVideoCall(1);
                } else {
                    console.log("播放中途退出，不下发游戏奖励");
                    // this.rewardVideoCall && this.rewardVideoCall(0);
                }
                
                this.showBanner();
                cc.vv.audioMgr && cc.vv.audioMgr.playBgm();
                setTimeout(() => {
                    this.loadRewardVideo();
                }, 60000);
            });

            this.videoAd = videoAd;
        } else {
            this.videoAd.load().then(() => {
                console.log("激励视频广告加载成功");
                this.isCachedVideo = true;
                this.VoideErrCount = 0;
            }).catch(err => {
                console.log("激励视频广告加载失败", err);

                this.VoideErrCount++;

                setTimeout(() => {
                    this.loadRewardVideo();
                }, 1000 * 60);
            });
        }
    },

    showRewardVideo(callBack) {
        if (this.videoAd && this.isCachedVideo) {
            this.rewardVideoCall = callBack;
            this.videoAd.show();
            cc.vv.audioMgr && cc.vv.audioMgr.stopBgm();
            this.hideBannder();
            this.isCachedVideo = false;
        } else {
            this.rewardVideoCall = '';
            cc.vv.hintMgr && cc.vv.hintMgr.show('暂无广告观看');
        }
    },

    //*****************插屏********************/
    loadInsert() {
        if (vivoConfig.InsertErrCount >= vivoConfig.ErrZCount){
            console.log('插屏超时');
            return;   
        }

        if (!this.insertAd) {
            let insertAd = this.insertAd = qg.createInterstitialAd({
                posId: vivoConfig.InsertId
            });

            insertAd.onLoad(() => {
                console.log('插屏广告加载成功');
                this.isCachedInsert = true;
                this.InsertErrCount = 0;
                if(vivoConfig.isCachedInsertLoadOverPlay){
                    this.showInstertView();
                }
            });

            insertAd.onError((err) => {
                this.InsertErrCount++;
                console.log("插屏打开失败");
                console.log(JSON.stringify(err));
                this.clearInsert();
                setTimeout(() => {
                    this.loadInsert();
                }, 1000 * 60);
            });

            insertAd.onClose(() => {
                console.log("插屏关闭");
                this.clearInsert();
                setTimeout(() => {
                    this.loadInsert();
                }, 1000 * 60);
            });
        } else {
            this.insertAd.load().then(() => {
                console.log("重新加载插屏成功");
                this.isCachedInsert = true;
                this.InsertErrCount = 0;
            }).catch((err) => {
                console.log("重新加载插屏失败");
                console.log(JSON.stringify(err));
                this.InsertErrCount++;

                this.clearInsert();
                setTimeout(() => {
                    this.loadInsert();
                }, 1000 * 60);
            })
        }
    },

    clearInsert() {
        this.isCachedInsert = false;
        this.insertAd = null;
    },

    showInstertView() {
        console.log("显示插屏vivo")
        if (this.insertAd) {
            this.insertAd.show().catch(() => {
                this.insertAd.load().then(() => {
                    this.insertAd.show();
                })
            })
        }
    },

    //**********************原生广告******************

    initNativeAd() {
        let nativeAd = qg.createNativeAd({
            posId: vivoConfig.NativeId
        });
        this.nativeAd = nativeAd;
        nativeAd.onLoad((res) => {
            console.log("原生广告加载成功------------------");
            console.log(JSON.stringify(res));
            if (res.adList && res.adList.length) {
                for (let i = 0; i < res.adList.length; i++) {
                    let m = new nativeAdItemModel();
                    m.parseFromVivo(res.adList[i]);
                    this.native_ad_list.push(m);
                }
            }
        });
        this.loadNativeAd();
    },

    loadNativeAd() {
        console.log('this.nativeAd', this.nativeAd);
        let adLoad = this.nativeAd.load();
        return new Promise((resolved,reject)=>{
            adLoad && adLoad.then(() => {
                console.log("原生广告加载成功");
                resolved(true)
            }).catch(err => {
                console.log('原生广告加载失败', JSON.stringify(err));
                setTimeout(() => {
                    this.loadNativeAd();
                }, 30 * 1000);
                resolved(false);
            })
        })
      
    },

    showNativeAdView() {
        if (this.native_ad_list.length <= 0) {
            return;
        }
        this.hideBannder();
        let model = this.native_ad_list[0];
        let callBack = {
            CloseHandle: () => {
                this.showBanner();
            },
            ClickHandle: () => {
                return new Promise((resolved,reject)=>{
                    this.reportNativeAdClick(model.adId);
                    this.showBanner();
                    this.loadNativeAd().then((res)=>{
                        resolved(res)
                    });
                })
               
            }
        }
        this.reportNativeAdShow(model.adId);
    },

    // adList: { 
    //     "adId": 0, 
    //     "title": "抖音极速版", 
    //     "desc": "看视频省流量领红包", 
    //     "icon": "http://imgwsdl.vivo.com.cn/appstore/developer/icon/20200115/202001151535271464328.png", 
    //     "imgUrlList": ["http://ads-marketing-vivofs.vivo.com.cn/NtBrJ9dueygDLoz8/material/img/20200430/ea580377d4ff4c4eae05c676b802a172.jpg"], 
    //     "logoUrl": "", 
    //     "clickBtnTxt": "", 
    //     "creativeType": 0, 
    //     "interactionType": 2 
    // }
    
    /**
     * 上报广告曝光，一个广告只有一次上报有效，adId 为 load 方法获取的广告数据的 adId 字段
     * @param adId 
     */
    reportNativeAdShow(adId) {
        this.nativeAd.reportAdShow({
            adId: adId
        });
    },

    /**
     * 上报广告点击，一个广告只有一次上报有效，adId 为 load 方法获取的广告数据的 adId 字段  
     * @param adId 
     */
    reportNativeAdClick(adId) {
        this.nativeAd.reportAdClick({
            adId: adId
        });
    },

    //振动
    openVibrateShort() {
        qg.vibrateShort({
            success: () => {
            },
            fail: () => {
            },
            complete: () => {
            }
        });
    },

    sendDesktop(func) {
        if (qg.installShortcut) {
            qg.installShortcut({
                success: function (res) {
                    console.log(JSON.stringify(res));
                    func(1)
                },
                fail: function (err) {
                    console.log(JSON.stringify(err));
                    func(0)
                },
                complete: function (res) {
                    console.log(JSON.stringify(res));
                }
            });
        } else {
            func(1)
        }
    },

    //是否创建桌面
    hasShortcutInstalled(callBack) {
        if (qg.hasShortcutInstalled) {
            qg.hasShortcutInstalled({
                success: function (status) {
                    if (status) {
                        callBack(1);
                    } else {
                        callBack(0);
                    }
                },
                fail: () => {},
                complete: () => {}
            })
        } else {
            callBack(0);
        }
    }
}

export default vivo;
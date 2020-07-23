import nativeAdItemModel from './nativeAdItemModel';

const oppoConfig = {
    AppId: "30271694",
    OpenScreenId: "169268",
    BannerId: "181272",
    RewardedVideoId: "181276",
    InsertId: "169267",
    NativeId: "181277",

    ErrZCount: 3,
    BannerErrCount: 0,
    VoideErrCount: 0,
    InsertErrCount: 0,

    //谨慎修改
    rewardVideoLoadOverPlay: false,
    isCachedInsertLoadOverPlay: false,
}

const oppo = {

    bannerAd: "",

    videoAd: "",
    rewardVideoCall: "",
    isCachedVideo: false,

    insertAd: "",
    isCachedInsert: false,

    nativeAd: "",
    native_ad_list: [],

    is_auto_close_banner: true,
    init() {
        let day = new Date().getDate()
        let count =0;
        let localday = cc.sys.localStorage.getItem("curDay")
        if(localday == null || localday == "" || day != localday) {
            cc.sys.localStorage.setItem("curDay",day)
            cc.sys.localStorage.setItem("NativeInsertCount",20);
        }
    },
    //***********************banner*******************
    loadBannerView() {
        if (oppoConfig.BannerErrCount >= oppoConfig.ErrZCount) {
            console.log("加载超时-----banner");
            return
        }

        if (!this.bannerAd) {
            //不设置style默认在顶部显示，布局起始位置为屏幕左上角
            let bannerAd = this.bannerAd = qg.createBannerAd({
                posId: oppoConfig.BannerId,
            });

            bannerAd.onLoad(() => {
                console.log('Banner广告加载成功');
                oppoConfig.BannerErrCount = 0;
                this.showBanner();
            });

            bannerAd.onShow(() => {
                console.log('Banner广告加载成功');
                oppoConfig.BannerErrCount = 0;
            });

            bannerAd.onError((err) => {
                console.log("banner 打开失败   " + JSON.stringify(err));
                oppoConfig.BannerErrCount++;
                this.is_auto_close_banner = true;
                bannerAd.offError(null);
                setTimeout(() => {
                    this.hideBannder();
                    this.loadBannerView();
                }, 1000 * 60);
            });

            bannerAd.onHide(() => {
                console.log("bannerAd 关闭");
                if (this.is_auto_close_banner) {
                    console.log("玩家关闭banner  本地数据减一  ");
                    cc.vv.userInfo && cc.vv.userInfo.serplusCloseBanner_oppo(-1);
                }
                this.bannerAd = null;
                this.is_auto_close_banner = true;
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

    //调用的hide为播放广告时关闭的hide 不属于玩家手动调用
    hideBannder() {
        if(this.bannerAd) {
            this.is_auto_close_banner = false;
            if (this.bannerAd.destroy) {
                var addestroy = this.bannerAd.destroy();
                addestroy && addestroy.then(() => {
                    console.log("banner广告销毁成功");
                }).catch(err => {
                    console.log("banner广告销毁失败", err);
                });
            }else{
                this.bannerAd.hide();
            }
        }else{
            this.is_auto_close_banner = true;
        }
        this.bannerAd = null;
    },

    //******************激励视频*******************/
    loadRewardVideo() {
        if (qg.createRewardedVideoAd == null) return;
        if (oppoConfig.VoideErrCount >= oppoConfig.ErrZCount) {
            console.log("加载超时-----video");
            return;
        }
        this.clearRewardVideo();
        if (!this.videoAd) {
            let videoAd = qg.createRewardedVideoAd({ posId: oppoConfig.RewardedVideoId });
            videoAd.load();
            videoAd.onLoad(() => {
                console.log('激励视频加载成功');
                this.isCachedVideo = true;
                oppoConfig.VoideErrCount = 0;
                if (oppoConfig.rewardVideoLoadOverPlay) {
                    this.showRewardVideo();
                }
            });
            videoAd.onError((err) => {
                console.log("激励视频播放失败" + JSON.stringify(err));
                this.clearRewardVideo();http://dotgameweb.kuaizhiyou.com.cn/
                oppoConfig.VoideErrCount++;
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
                }
                this.showBanner();
                cc.vv.audioMgr && cc.vv.audioMgr.playBgm();
                setTimeout(() => {
                    this.loadRewardVideo();
                }, 1000);
            });

            this.videoAd = videoAd;
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

    clearRewardVideo() {
        if (this.videoAd) {
            this.videoAd.offError(() => { });
            this.videoAd.offLoad(() => { });
            this.videoAd.offRewarded(() => { });
            this.videoAd.offVideoStart(() => { });
            this.videoAd.destroy();
            this.videoAd = null;
        }
    },


    //*****************插屏********************/
    loadInsert() {
        if (oppoConfig.InsertErrCount >= oppoConfig.ErrZCount){
            console.log('插屏超时');
            return;   
        }

        if (!this.insertAd) {
            let insertAd = this.insertAd = qg.createInterstitialAd({
                posId: oppoConfig.InsertId
            });

            insertAd.onLoad(() => {
                console.log('插屏广告加载成功');
                this.isCachedInsert = true;
                this.InsertErrCount = 0;
                if(oppoConfig.isCachedInsertLoadOverPlay){
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
        console.log("显示插屏oppo")
        if (this.insertAd) {
            this.insertAd.show().catch(() => {
                this.insertAd.load().then(() => {
                    this.insertAd.show();
                })
            })
        }
    },

    //**********************原生广告******************
    clearNativeAd() {
        if(this.nativeAd) {
            console.log("原生 clearNativeAd")
            this.nativeAd.destroy();
            this.native_ad_list = [];
            this.nativeAd = null;
        }
    },

    initNativeAd() {
        let nativeAd = qg.createNativeAd({
            posId: oppoConfig.NativeId
        });
        this.nativeAd = nativeAd;
        nativeAd.onLoad((res) => {
            console.log("原生广告加载成功------------------");
            console.log("原生",JSON.stringify(res));
            console.log("原生",typeof(res))
            if(typeof(res) == "string") {
                console.log("原生 转化")
                res = JSON.parse(res)
            }
         
            if(res.adList) {
             
               for(let i=0;i<res.adList.length;i++) {
                
                 
                   let m = nativeAdItemModel.create();

                   nativeAdItemModel.parseFromOppo(m,res.adList[i]);
                 
                   this.native_ad_list.push(m);
                  
               }

               console.log("原生 list长度",this.native_ad_list.length)
            }
        });
        nativeAd.onError((res)=>{
            console.log("[原生广告]加载错误",JSON.stringify(res))
            setTimeout(()=>{
                this.clearNativeAd();
                this.initNativeAd();
            })
        })
        this.loadNativeAd();
    },

    loadNativeAd() {
        console.log('原生this.nativeAd', this.nativeAd);
        let adLoad = this.nativeAd.load();
        /*
        adLoad && adLoad.then(() => {
            console.log("原生广告加载成功");
        }).catch(err => {
            console.log('原生广告加载失败', JSON.stringify(err));
            setTimeout(() => {
                this.loadNativeAd();
            }, 30 * 1000);
        })
        */
    },
    getNativeInsertCount() {
        let c = cc.sys.localStorage.getItem("NativeInsertCount");
        if(c == null || c== "") {
            c =0;
        }
        return parseInt(c);
    },
    subNativeInsertCount() {
        let c = this.getNativeInsertCount();
        if (c == 0) return;
        c--;
        cc.sys.localStorage.setItem("NativeInsertCount",c);
    },
    showNativeAdView() {
        if (this.native_ad_list.length <= 0) {
            console.log("[原生广告未获取到广告长度]")
            this.clearNativeAd();
            this.initNativeAd();
            return false;
        }

        let count = this.getNativeInsertCount();
        if(count <=0) {
            console.log("[原生广告]数量不足",count)
            return false;
        }

        if(this.open_insert_timer != null) {
            let time = new Date();
            let t = time.getTime() - this.open_insert_timer.getTime();
            if ((count <= 3 && t < 30 * 1000) || (count > 3 && t < 60 * 1000)) { 
                return false;
            }
            this.open_insert_timer = time;
        } else {
            this.open_insert_timer = new Date();
        }

        this.hideBannder();
        let model = this.native_ad_list[0];
        let callBack = {
            CloseHandle: () => {
                this.showBanner();
            },
            ClickHandle: () => {
                this.reportNativeAdClick(model.adId);
                this.showBanner();
                this.loadNativeAd();
            },
            GetModel:()=>{
                return model
            }
        }

        this.reportNativeAdShow(model.adId);
        this.subNativeInsertCount();
        console.log("[原生广告]获取成功，返回对象")
        return callBack

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
            success: () => {},
            fail: () => {},
            complete: () => {}
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
    },

    openGame(name) {
        if(!name){return}
        qg.navigateToMiniGame({
            pkgName: name
        });
    }
}

export default oppo;
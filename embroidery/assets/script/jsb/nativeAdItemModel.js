var nativeAdItemModel = {
    /**
      * 广告标识，用来上报曝光与点击
      */
    
    adId: 0,
    /**
     * 广告标题
     */
    title:  "",
    /**
     * 广告描述
     */
    desc:  "",
    /**
     * 	推广应用的Icon图标
     */
    icon: [],
    /**
     * 	广告图片
     */
    imgUrlList:  [],
    /**
     * 广告标签图片
     */
    logoUrl: "",
    /**
     * 点击按钮文本描述
     */
    clickBtnTxt: "",
    /**
     * 	获取广告类型，取值说明：0：混合
     */
    creativeType: 0,
    /**
     * 获取广告点击之后的交互类型，取值说明： 1：网址类 2：应用下载类 8：快应用生态应用
     */
    interactionType: 0,
   
    parseFromVivo(obj,m) {
        obj.adId = m.adId;
        obj.title = m.title;
        obj.desc = m.desc;
        obj.clickBtnTxt = m.clickBtnTxt;
        obj.creativeType = m.creativeType;
        obj.icon.push(m.icon);
        obj.imgUrlList = [].concat(m.imgUrlList);
        obj.logoUrl = m.logoUrl;
        obj.clickBtnTxt = m.clickBtnTxt;
        obj.creativeType = m.creativeType;;
        if (m.interactionType == 2) {
            obj.interactionType = 'Download';
        } else {
            obj.interactionType = 'Website';
        }
    },

   
    create() {
        let o = {}
        o.__proto__ = nativeAdItemModel.prototype;
      
        return o;
    },
    parseFromOppo(obj,m) {
        obj.adId = m.adId;
        obj.title = m.title;
        obj.desc = m.desc;
        obj.clickBtnTxt = m.clickBtnTxt;
        obj.creativeType = m.creativeType;
        obj.icon = [].concat(m.iconUrlList);
        obj.imgUrlList = [].concat(m.imgUrlList);
        obj.logoUrl = m.logoUrl;
        obj.clickBtnTxt = m.clickBtnTxt;
        obj.creativeType = m.creativeType;
        switch (m.interactionType) {
            case 1:
                obj.interactionType = 'Browse';
                break;
            case 2:
            case 3:
                obj.interactionType = 'Download';
                break;
            default:
                obj.interactionType = 'Browse';
                break;
        }
    }
}


export default nativeAdItemModel;
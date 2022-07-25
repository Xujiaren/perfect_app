import CameraRoll from '@react-native-community/cameraroll';
import RNFS from 'react-native-fs';
import { Platform } from 'react-native';

export const DownloadMedia = (uri, isVideo) => {
    if (!uri) return null;
    return new Promise((resolve, reject) => {
        let timestamp = (new Date()).getTime();//获取当前时间错
        let random = String(((Math.random() * 1000000) | 0))//六位随机数
        let dirs = Platform.OS === 'ios' ? RNFS.LibraryDirectoryPath : RNFS.ExternalDirectoryPath; //外部文件，共享目录的绝对路径（仅限android）
        const downloadDest = `${dirs}/${timestamp+random}.` + (isVideo ? 'mp4' : 'png');
        const formUrl = uri;
        const options = {
            fromUrl: formUrl,
            toFile: downloadDest,
            background: true,
            begin: (res) => {
                // console.log('begin', res);
                // console.log('contentLength:', res.contentLength / 1024 / 1024, 'M');
            },
        };
        try {
            const ret = RNFS.downloadFile(options);
            ret.promise.then(res => {
                // console.log('success', res);
                // console.log('file://' + downloadDest)
                var promise = CameraRoll.save(downloadDest);
                promise.then(function(result) {
                   // alert('保存成功！地址如下：\n' + result);
                }).catch(function(error) {
                     console.log('error', error);
                    // alert('保存失败！\n' + error);
                });
                resolve(res);
            }).catch(err => {
                reject(new Error(err))
            });
        } catch (e) {
            reject(new Error(e))
        }
    })
}
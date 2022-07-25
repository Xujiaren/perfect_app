import * as request from '../../util/net';

export function index(ftype, page, parentId) {
    return request.get('/user/down', {
        ftype: ftype,
        page: page,
        parentId: parentId,
	});
}

export function download({down_id}) {
    return request.post('/user/down/' + down_id, {
	});
}

export function like({down_id}) {
    return request.post('/user/like/download/' + down_id, {
	});
}

export function removeLike({down_id,galleryId}) {
    return request.post('/user/like/download/remove/' + down_id, {
        galleryId:galleryId
	});
}
export function likes({gallery_id,ctype}) {
    return request.post('/user/like/anything/' + gallery_id, {
        ctype:ctype
	});
}

export function removeLikes({gallery_id,ctype}) {
    return request.post('/user/like/anything/remove/' + gallery_id, {
        ctype:ctype
	});
}
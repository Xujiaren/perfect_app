import * as request from '../../util/net';

export function init({parentId}) {
    return request.post('/forest', {
        parentId: parentId,
	});
}

export function index(target_id) {
    return request.get('/forest/' + target_id, {
        
	});
}

export function cert(target_id, type) {
    return request.get('/forest/cert/' + target_id + '/' + type, {
	});
}

export function shop() {
    return request.get('/forest/goods', {
	});
}

export function order({goods_id, address_id}) {
    return request.post('/forest/goods/' + goods_id, {
        address_id: address_id,
	});
}

export function userOrder(page) {
    return request.get('/forest/goods/order', {
        page: page,
	});
}

export function pick({forest_id}) {
    return request.post('/forest/pick', {
        forest_id: forest_id,
	});
}

export function qa() {
    return request.get('/forest/qa', {
	});
}

export function seeds() {
    return request.get('/forest/seed', {
	});
}

export function seed({seed_id, type, num, old_seed_id}) {
    return request.post('/forest/seed/' + type + '/' + seed_id, {
        num: num,
        old_seed_id: old_seed_id,
	});
}

export function share({timestamp}) {
    return request.post('/forest/share', {
        timestamp: timestamp,
	});
}

export function steal({target_id, sun_id}) {
    return request.post('/forest/steal/' + target_id, {
        sun_id: sun_id,
	});
}

export function water({target_id, forest_id, sun}) {
    return request.post('/forest/water/' + target_id + '/' + forest_id, {
        sun: sun,
	});
}

export function connect({target_id, type}) {
    return request.post('/forest/user/friend/' + type, {
        target_id: target_id,
	});
}

export function friend(type, page) {
    return request.get('/forest/user/' + type, {
        page: page,
	});
}
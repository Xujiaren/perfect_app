import * as request from '../../util/net';

export function paper(paper_id, level_id, lessDuration) {
    return request.get('/exam/' + paper_id, {
        levelId: level_id,
        lessDuration: lessDuration,
	});
}

export function test(test_id) {
    return request.get('/exam/test/info', {
        testId: test_id,
	});
}

export function review(test_id) {
    return request.get('/exam/review/' + test_id, {
	});
}

export function answer({test_id, duration, answer, level_id}) {
    return request.post('/user/exam/' + test_id, {
        duration: duration,
        answer: answer,
        levelId: level_id,
	});
}
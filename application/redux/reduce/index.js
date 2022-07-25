import { combineReducers } from 'redux';

import site from './site';
import home from './home';
import course from './course';
import teacher from './teacher';
import article from './article';
import passport from './passport';
import user from './user';
import study from './study';
import find from './find';
import activity from './activity';
import train from './train';
import pker from './pker';
import exam from './exam';
import address from './address';
import mall from './mall';
import charge from './charge';
import ask from './ask';
import download from './download';
import forest from './forest';
import meet from './meet';
import message from './message';

export default combineReducers({
    site,
    home,
    course,
    teacher,
    article,
    find,
    study,
    passport,
    user,
    activity,
    train,
    pker,
    exam,
    address,
    charge,
    mall,
    ask,
    download,
    forest,
    meet,
    message,
});

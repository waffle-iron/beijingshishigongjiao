import {observable, computed, action} from  'mobx';
// import http from '../api';
import http from '../api/axios';

class List {
  name = '啦啦啦';
  @observable numClicks = 0;
  @observable list = [];

  @computed get oddOrEven() {
    return this.numClicks % 2 === 0 ? 'even' : 'odd';
  }

  @action clickButton() {
    this.numClicks++;
  }

  @action getList() {
    http.get('/test').then(function (data) {
      console.log('data', data);
    });
    // console.log('11', http.get('/test'));

  }
}


export default  List;
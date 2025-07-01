import { reactive } from 'vue';

const store = reactive({
  username: localStorage.getItem('username') || null,
  token: localStorage.getItem('token') || null,

  login(username, token = null) {
    localStorage.setItem('username', username);
    if (token) localStorage.setItem('token', token);
    this.username = username;
    if (token) this.token = token;
  },
  logout() {
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    this.username = null;
    this.token = null;
  },
  get isLoggedIn() {
    return !!this.username || !!this.token;
  }
});

export default store;

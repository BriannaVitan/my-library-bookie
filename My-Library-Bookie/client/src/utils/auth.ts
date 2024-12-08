class Auth {
  static loggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  static logout(): void {
    localStorage.removeItem('id_token');
    window.location.assign('/');
  }

  private static getToken(): string | null {
    return localStorage.getItem('id_token');
  }

  private static isTokenExpired(token: string): boolean {
    try {
      const decoded: any = JSON.parse(atob(token.split('.')[1]));
      if (decoded.exp < Date.now() / 1000) {
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  }
}

export default Auth;
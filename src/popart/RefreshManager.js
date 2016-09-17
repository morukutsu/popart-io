class RefreshManager {
    constructor() {
        this.mustRefresh = false;
    }

    scheduleRefresh() {
        this.mustRefresh = true;
    }

    clearRefresh() {
        this.mustRefresh = false;
    }

    getRefreshFlag() {
        return this.mustRefresh;
    }
};

let refreshManager = new RefreshManager();

export default refreshManager;

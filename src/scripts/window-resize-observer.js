import EventEmitter from "eventemitter3";
import throttle from "lodash.throttle";

export class WindowResizeObserver extends EventEmitter { //  
	constructor(delay = 100) {
		super();
		this.lastWidth = null;
		this.lastHeight = null;
		window.addEventListener("resize", throttle(() => this.onResize(), delay, { leading: false }));
	}
	onResize() {
		if (this.isTriggeringResize()) this.emit("resize");
	};
	isTriggeringResize() {
		const triggeringHeightChange = Math.abs(this.lastHeight - window.innerHeight) > window.innerHeight * 0.2;
		console.log(triggeringHeightChange, this.lastWidth === window.innerWidth);
		if (!triggeringHeightChange && this.lastWidth === window.innerWidth) return false;
		this.lastWidth = window.innerWidth;
		this.lastHeight = window.innerHeight;
			console.log("Triggering resize");
		return true;
	}
}
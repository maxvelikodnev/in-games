import "../styles/index.scss";
import { isMobile } from "./utils.js";
import initDisclosures from "./disclosure.js";

window.app = window.app || {};
window.app.hoverMedia = window.matchMedia("(any-hover: hover)");

document.documentElement.classList.toggle("is-mobile", isMobile.any());

app.drawers.init();

initDisclosures();

class InitialAnimation {
	constructor() {
		this.dom = { msgRoot: document.querySelector("#hero-msg"), root: document.querySelector("#hero") };
		this.dom.head = this.dom.msgRoot.querySelector(".hero-msg__head");
		this.dom.eye = this.dom.msgRoot.querySelector(".hero-msg__eye");
		this.dom.y = this.dom.msgRoot.querySelector(".hero-msg__y");
		this.dom.u = this.dom.msgRoot.querySelector(".hero-msg__u");
		this.dom.decorRed = this.dom.root.querySelector(".hero__decor_red");
		this.dom.decorBlue = this.dom.root.querySelector(".hero__decor_blue");
		this.dom.decorGreen = this.dom.root.querySelector(".hero__decor_green");
		this.dom.decorOrange = this.dom.root.querySelector(".hero__decor_orange");
		this.init();
	}
	init () {
		if (false) return; // Animation disabled (start not from the top or already animated);
		console.log('InitialAnimation');
		document.documentElement.classList.add("splash-will-animate");
		window.scrollTo({ top: 0, behavior: "instant" });
		this.rebuildAnimations();
		this.tl.play();
	}
	// window.app.windowResizeObserver.on("resize", () => this.onResize());
	// this.onResize();

	// onResize() {
	// 	this.rebuildAnimations();
	// }
	rebuildAnimations() {
		const self = this;
		this.context?.revert();
		this.context = gsap.context(() => {
			this.tl = gsap.timeline({
				// scrollTrigger: {
				// 	trigger: "#hero",
				// 	start: "top top",
				// 	endTrigger: "#mail-to-us",
				// 	end: "bottom-=10% bottom",
				// 	scrub: 0.5,
				// 	invalidateOnRefresh: true,
				// }
			});
			const rootBcr = this.dom.msgRoot.getBoundingClientRect();
			const customEase = CustomEase.create("custom", "M0,0 C0.19,0.28 0.177,0.949 0.482,1.015 0.675,1.056 0.762,1.012 1,1 ");
			const msgInitialWidth = Math.min(window.innerWidth * 0.42, 486);
			const msgMidScale = msgInitialWidth / this.dom.msgRoot.offsetWidth;
			this.tl.addLabel("start", 0.5);
			this.tl.from(".hero-msg__inner", {
					scale: msgMidScale,
					transformOrigin: "center center",
					duration: 1.8,
					ease: "elastic.out(1,0.3)"
				}, "start");
			this.tl.from(".hero-msg__text, .hero-msg__y, .hero-msg__u", {
					opacity: 0,
					duration: 0.3,
					ease: "power1.inOut"
				}, "<");
			// Показываем кубики
			this.tl.from(".hero__decorations", {
				opacity: 0,
				duration: 0.5,
				ease: "power1.inOut"
			}, "<");
			// Надпись возвращается на место
			this.tl.fromTo(".hero-msg", {
				y: `${(window.innerHeight - this.dom.msgRoot.offsetHeight * msgMidScale) / 2 - rootBcr.top}px`,
				scale: msgMidScale,
				ease: customEase
			}, {
				y: 0,
				scale: msgMidScale,
				duration: 1,
				ease: customEase
			});
			// Убираем подложку
			this.tl.from(".hero__underlay", {
				opacity: 1,
				visibility: "visible",
				duration: 1,
				ease: customEase
			}, "<");
			// Анимируем кубики
			const redDecorBcr = this.dom.decorRed.getBoundingClientRect();
			this.tl.fromTo(".hero__decor_red", {
				scale: 0.4,
				x: window.innerWidth * 0.5 + msgInitialWidth * 0.75 - (redDecorBcr.left + redDecorBcr.width / 2),
				y: window.innerHeight * 0.5 - (msgInitialWidth * 0.23) - (redDecorBcr.top + redDecorBcr.height / 2),
				duration: 1,
				ease: customEase
			}, {
				scale: 1,
				x: 0,
				y: 0,
				rotationZ: -15,
				duration: 1,
				ease: customEase
			}, "<");
			const blueDecorBcr = this.dom.decorBlue.getBoundingClientRect();
			this.tl.fromTo(".hero__decor_blue", {
				scale: 0.4,
				x: window.innerWidth * 0.5 - msgInitialWidth * 0.69 - (blueDecorBcr.left + blueDecorBcr.width / 2),
				y: window.innerHeight * 0.5 + (msgInitialWidth * 0.23) - (blueDecorBcr.top + blueDecorBcr.height / 2),
				duration: 1,
				ease: customEase
			}, {
				scale: 1,
				x: 0,
				y: 0,
				rotationZ: 15,
				rotationY: 180,
				duration: 1,
				ease: customEase
			}, "<");
			const greenDecorBcr = this.dom.decorGreen.getBoundingClientRect();
			this.tl.from(".hero__decor_green", {
				scale: 0.4,
				x: window.innerWidth * 0.5 + msgInitialWidth * 0.48 - (greenDecorBcr.left + greenDecorBcr.width / 2),
				y: window.innerHeight * 0.5 + (msgInitialWidth * 0.24) - (greenDecorBcr.top + greenDecorBcr.height / 2),
				duration: 1,
				ease: customEase
			}, "<");
			const orangeDecorBcr = this.dom.decorOrange.getBoundingClientRect();
			this.tl.fromTo(".hero__decor_orange", {
				scale: 0.4,
				x: window.innerWidth * 0.5 - msgInitialWidth * 0.48 - (orangeDecorBcr.left + orangeDecorBcr.width / 2),
				y: window.innerHeight * 0.5 - (msgInitialWidth * 0.576) - (orangeDecorBcr.top + orangeDecorBcr.height / 2),
				
			}, {
				scale: 1,
				x: 0,
				y: 0,
				rotation: -40,
				duration: 1,
				ease: customEase
			}, "<");
			//

			// Показываем шапку
			this.tl.from("header", {
				opacity: 0,
				visibility: "hidden",
				duration: 1,
				ease: "power1.inOut"
			}, "<");

			// Уменьшаем надпись до нормального размера
			this.tl.fromTo(".hero-msg", {
				scale: msgMidScale, 
			}, {
				scale: 1,
				duration: 0.8,
				ease: customEase
			});
			// Возвращаем поворот кубика
			this.tl.to(".hero__decor_orange", {
				rotation: 30,
				duration: 1,
				ease: customEase
			}, "<");
			this.tl.to(".hero__decor_blue", {
				rotationZ: -15,
				duration: 1,
				ease: customEase
			}, "<");
			this.tl.to(".hero__decor_green", {
				rotationZ: -15,
				duration: 1,
				ease: customEase
			}, "<");
			this.tl.to(".hero__decor_red", {
				rotationZ: 15,
				duration: 1,
				ease: customEase
			}, "<");
			this.tl.fromTo(".hero__about", {
					y: "20vh",
					opacity: 1,
				},
				{
					y: "20vh",
					opacity: 0,
					ease: "power1.inOut",
					duration: 0.25,
				},"<");
			this.tl.to(".hero__about", {
				keyframes: [
					{
						y: 0,
						duration: 0
					},
					{
						opacity: 1,
						duration: 0.25,
						ease: "power1.inOut"
					},
				]
			},"<+=0.25");
			this.tl.from(".hero__all-heros", {
				scale: 0.8,
				y: "30%",
				duration: 0.5,
				ease: customEase,
				transformOrigin: "center bottom",
			},"<-=0.15");
			this.tl.from(".hero__bottom-decor-wrap", {
				scale: 0.8,
				y: "50%",
				duration: 0.5,
				ease: customEase,
				transformOrigin: "center bottom",
			},"<-=0.15");

			

			this.tl.eventCallback("onStart", () => {
				document.documentElement.classList.remove("splash-will-animate");
				document.documentElement.classList.add("splash-is-animating");
			});
			this.tl.eventCallback("onComplete", () => {
				document.documentElement.classList.remove("splash-is-animating");
			});
		});
	}
}

new InitialAnimation();

function setViewportHeight() {
  document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
}
// Устанавливаем значение при загрузке страницы
setViewportHeight();

// Обновляем при изменении размеров экрана
window.addEventListener('resize', setViewportHeight);

document.documentElement.classList.add("is-initialised");
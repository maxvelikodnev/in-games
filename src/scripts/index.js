import "../styles/index.scss";
import throttle from "lodash.throttle";
import { isMobile } from "./utils.js";
import initDisclosures from "./disclosure.js";
import { WindowResizeObserver } from "./window-resize-observer.js";
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

gsap.registerPlugin(ScrollTrigger, Physics2DPlugin, PhysicsPropsPlugin, InertiaPlugin);

window.app = window.app || {};
window.app.hoverMedia = window.matchMedia("(any-hover: hover)");
window.app.windowResizeObserver = new WindowResizeObserver();
window.app.isMobile = isMobile.any();
document.documentElement.classList.toggle("is-mobile", window.app.isMobile);

// Initialize Lenis
const lenis = new Lenis({ });

// Synchronize Lenis scrolling with GSAP's ScrollTrigger plugin
lenis.on('scroll', ScrollTrigger.update);

// Add Lenis's requestAnimationFrame (raf) method to GSAP's ticker
// This ensures Lenis's smooth scroll animation updates on each GSAP tick
gsap.ticker.add((time) => {
  lenis.raf(time * 1000); // Convert time from seconds to milliseconds
});

// Disable lag smoothing in GSAP to prevent any delay in scroll animations
gsap.ticker.lagSmoothing(0);

let humanScroll = true;
Observer.create({
  target: window, // can be any element (selector text is fine)
  type: "wheel,touch,pointer", // comma-delimited list of what to listen for ("wheel,touch,scroll,pointer")
  onChangeY: () => humanScroll = true,
});


const scrollEaseFunc =  (x) => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
if (!window.app.isMobile && window.app.hoverMedia.matches) {
	lenis.on('scroll', (self) => {
		if (!lenis.isScrolling && humanScroll) {
			humanScroll = false;
			if (lenis.direction === 1) {
				lenis.scrollTo(window.scrollY - 20, { easing: scrollEaseFunc, duration: 0.5 });
			} else {
				lenis.scrollTo(window.scrollY + 20, { easing: scrollEaseFunc, duration: 0.5 });
			}
		}
	});
}



app.drawers.init();

initDisclosures();
const rallbackEase = CustomEase.create("custom", "M0,0 C0.19,0.28 0.177,0.949 0.482,1.015 0.675,1.056 0.762,1.012 1,1 ");
const smallRallbackEase = CustomEase.create("custom", "M0,0 C0.145,0.272 0.225,1.16 0.624,1.095 0.794,1.066 0.795,1.01 1,1 ");
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
		setTimeout(this.init(), 1);
	}
	init () {

		const hash = window.location.hash;
		if (hash) {
			const targetSection = document.querySelector(hash);
			if (targetSection) {
				scrollToSection(targetSection);
			}
		} else {
			console.log('InitialAnimation');
			document.documentElement.classList.add("splash-will-animate");
			window.scrollTo({ top: 0, behavior: "instant" });
			this.rebuildAnimations();
			this.tl.play();
		}

		if (false) return; // Animation disabled (start not from the top or already animated);

		//scrollToHash();

		//document.documentElement.classList.remove("splash-will-animate");
	}
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
				ease: rallbackEase
			}, {
				y: 0,
				scale: msgMidScale,
				duration: 1,
				ease: rallbackEase
			});
			// Убираем подложку
			this.tl.from(".hero__underlay", {
				opacity: 1,
				visibility: "visible",
				duration: 1,
				ease: rallbackEase
			}, "<");
			// Анимируем кубики
			const redDecorBcr = this.dom.decorRed.getBoundingClientRect();
			this.tl.fromTo(".hero__decor_red", {
				scale: 0.4,
				x: window.innerWidth * 0.5 + msgInitialWidth * 0.75 - (redDecorBcr.left + redDecorBcr.width / 2),
				y: window.innerHeight * 0.5 - (msgInitialWidth * 0.23) - (redDecorBcr.top + redDecorBcr.height / 2),
				duration: 1,
				ease: rallbackEase
			}, {
				scale: 1,
				x: 0,
				y: 0,
				rotationZ: -15,
				duration: 1,
				ease: rallbackEase
			}, "<");
			const blueDecorBcr = this.dom.decorBlue.getBoundingClientRect();
			this.tl.fromTo(".hero__decor_blue", {
				scale: 0.4,
				x: window.innerWidth * 0.5 - msgInitialWidth * 0.69 - (blueDecorBcr.left + blueDecorBcr.width / 2),
				y: window.innerHeight * 0.5 + (msgInitialWidth * 0.23) - (blueDecorBcr.top + blueDecorBcr.height / 2),
				duration: 1,
				ease: rallbackEase
			}, {
				scale: 1,
				x: 0,
				y: 0,
				rotationZ: 15,
				rotationY: 180,
				duration: 1,
				ease: rallbackEase
			}, "<");
			const greenDecorBcr = this.dom.decorGreen.getBoundingClientRect();
			this.tl.from(".hero__decor_green", {
				scale: 0.4,
				x: window.innerWidth * 0.5 + msgInitialWidth * 0.48 - (greenDecorBcr.left + greenDecorBcr.width / 2),
				y: window.innerHeight * 0.5 + (msgInitialWidth * 0.24) - (greenDecorBcr.top + greenDecorBcr.height / 2),
				duration: 1,
				ease: rallbackEase
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
				ease: rallbackEase
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
				ease: rallbackEase
			});
			// Возвращаем поворот кубика
			this.tl.to(".hero__decor_orange", {
				rotation: 30,
				duration: 1,
				ease: rallbackEase
			}, "<");
			this.tl.to(".hero__decor_blue", {
				rotationZ: -15,
				duration: 1,
				ease: rallbackEase
			}, "<");
			this.tl.to(".hero__decor_green", {
				rotationZ: -15,
				duration: 1,
				ease: rallbackEase
			}, "<");
			this.tl.to(".hero__decor_red", {
				rotationZ: 15,
				duration: 1,
				ease: rallbackEase
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
				ease: rallbackEase,
				transformOrigin: "center bottom",
			},"<-=0.15");
			this.tl.from(".hero__bottom-decor-wrap", {
				scale: 0.8,
				y: "50%",
				duration: 0.5,
				ease: rallbackEase,
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


// class ForceCollector extends EventEmitter {
// 	force = 0;
// 	constructor(max) {
// 		this.max = max;
// 	}
// 	update() {

// 	}
// 	add(value) {

// 	}
// 	sub(value) {

// 	}
// }
if(document.querySelector("#hero"))
new InitialAnimation();
function scrollToSection(sectionElem) {
	if (!sectionElem) return false;
	const sectionBcr = sectionElem.getBoundingClientRect();
	const newScrollPos = sectionBcr.top + window.scrollY - 80;
	window.scrollTo({ top: newScrollPos, behavior: 'smooth' });
	return true;
}
class Navigation {
	activeLink = null;
	activeSection = null;
	constructor() {
		this.observer = new IntersectionObserver((entries) => {
			const filtered = entries.filter(({ isIntersecting }) => isIntersecting);
			if (!filtered.length) return;
			this.setActiveSection(filtered.length > 1 ? filtered[1].target : filtered[0].target);
		}, { threshold: 0, rootMargin: "-10% 0% -89% 0%" });
		this.links = Array.from(document.querySelectorAll(".header-nav__link"));
		this.sections = Array.from(document.querySelectorAll("main > section"));
		this.sections.forEach(elem => this.observer.observe(elem));

		document.addEventListener("scroll", throttle(() => {
			document.documentElement.classList.toggle("_scrolled", window.scrollY > 50);
			document.documentElement.classList.toggle("_dark-header", window.scrollY > window.innerHeight);
			if (window.scrollY < window.innerHeight / 2) {
				this.setActiveSection(this.sections[0]);
			}
		}), 25);

		this.links.forEach(link => link.addEventListener("click", (e) => {
			const href = link.getAttribute("href");

			if (!href) return; // Если у ссылки нет href, ничего не делаем

			// Проверяем, является ли ссылка якорной
			if (href.charAt(0) === '#') {
				e.preventDefault(); // Останавливаем стандартное поведение ссылки

				const targetSection = document.querySelector(href);
				const isCurrentPage = window.location.pathname === "/"; // Проверяем, на главной ли странице

				if (targetSection) {
					// Если секция есть на текущей странице, просто скроллим
					app.drawers.close("main-menu");

					if (href === "#hero") {
						window.scrollTo({ top: 0, behavior: 'smooth' });
					} else {
						scrollToSection(targetSection);
					}

					history.pushState(null, null, href);
				} else if (!isCurrentPage) {
					// Если секции нет и мы НЕ на главной — переходим на главную с #hash
					window.location.href = `/${href}`;
				}
			} else {
				// Обычные ссылки ведут на другую страницу
				window.location.href = href;
			}
		}));

		document.querySelector("#contact-us-btn")?.addEventListener("click", (e) => {
			e.preventDefault();
			scrollToSection(this.sections.find(elem => elem.getAttribute("id") === "contact-us"));
		});
	}
	setActiveSection(next) {
		this.activeSection = next;
		this.activeLink?.classList.remove("_active");
		this.activeLink = null;
		if (!next) return;
		const sectionId = next.getAttribute("id");
		const link = this.links.find(elem => elem.getAttribute("href").includes(sectionId));
		if (!link) return;
		this.activeLink = link;
		link.classList.add("_active");
	}
}
new Navigation();

function setViewportHeight() {
  document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
}
// Устанавливаем значение при загрузке страницы
setViewportHeight();

class AboutUsAnimation {
	constructor() {
		this.dom = { msgRoot: document.querySelector("#hero-msg"), root: document.querySelector("#hero") };

		this.init();
	}
	init () {
		if (false) return; // Animation disabled (start not from the top or already animated);
		console.log('AboutUsAnimation');
		this.rebuildAnimations();
		//this.tl.play();
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
			this.pic01tween = gsap.from(".about-us__img_1", {
				scrollTrigger: {
					trigger: ".about-us__img_1",
					start: "+=45% bottom",
				},
				x: "-30%",
				duration: 1.5,
				ease: smallRallbackEase,
			});
			this.pic02tween = gsap.from(".about-us__img_2", {
				scrollTrigger: {
					trigger: ".about-us__img_2",
					start: "+=45% bottom",
				},
				x: "30%",
				duration: 1.5,
				ease: smallRallbackEase,
			});
			this.pic01tween = gsap.from(".about-us__img_3", {
				scrollTrigger: {
					trigger: ".about-us__img_3",
					start: "+=45% bottom",
				},
				x: "-30%",
				duration: 1.5,
				ease: smallRallbackEase,
			});
			Observer.create({
				target: window, // can be any element (selector text is fine)
				type: "scroll", // comma-delimited list of what to listen for ("wheel,touch,scroll,pointer")
				onUp: throttle((self) => gsap.to(".about-info, .about-us__quote", { inertia: {
					y: { velocity: 10,  min: 0, max: 0 }
				}}), 25), //, onComplete: function () { this.reverse() },
				onDown: throttle((self) => gsap.to(".about-info, .about-us__quote", { inertia: {
					y: { velocity: -10,  min: 0, max: 0 }
				}}), 25) //, onComplete: function () { this.reverse() }
			});
		});
	}
}
new AboutUsAnimation();

class OurAppsAnimation {
	constructor() {
		this.slides = document.querySelectorAll("#apps .our-apps-card");
		this.body = document.querySelector("#apps .our-apps__body");
		this.init();
	}
	init () {
		if (false) return; // Animation disabled (start not from the top or already animated);
		console.log('OurAppsAnimation');
		this.rebuildAnimations();
		window.app.windowResizeObserver.on("resize", () => this.onResize());
		this.onResize();
	}
	onResize() {
		this.rebuildAnimations();
	}
	rebuildAnimations() {
		const self = this;
		this.gap = gsap.getProperty(".our-apps__body", "column-gap");
		this.slideWidth = gsap.getProperty(".our-apps__body .our-apps-card", "width");
		this.lastPositionIdx = this.slides.length - 1;
		this.fullWidth = this.slideWidth * this.slides.length + this.gap * this.lastPositionIdx;
		const calcPath = (pos) => this.lastPositionIdx === pos ? -this.fullWidth + this.body.offsetWidth : -(this.slideWidth + this.gap) * pos;
		this.context?.revert();

		this.context = gsap.context(() => {
			if (window.innerWidth >= 1200) {
				this.slideTween = gsap.quickTo(".our-apps__body", "x", {
					duration: 0.8, ease: rallbackEase,
					onUpdate: throttle(() => {
							gsap.to(".our-apps-card_mt .our-apps-card__object_3 img, .our-apps-card_mt .our-apps-card__object_4 img, .our-apps-card_mt .our-apps-card__object_5 img", {
								inertia: {
									x: { velocity: 15 * this.direction,  min: 0, max: 0 },
									rotation: { velocity: 10 * this.direction,  min: 0, max: 0 },
								}
							});
							gsap.to(".our-apps-card_bt .our-apps-card__object_1 img, .our-apps-card_bt .our-apps-card__object_2 img", {
								inertia: {
									x: { velocity: 5 * this.direction,  min: 0, max: 0 },
									y: { velocity: -10,  min: 0, max: 0 },
									rotation: { velocity: 5 * this.direction,  min: 0, max: 0 },
								}
							});
							gsap.to(".our-apps-card_bt .our-apps-card__object_4 img, .our-apps-card_bt .our-apps-card__object_5 img", {
								inertia: {
									y: { velocity: -10,  min: 0, max: 0 },
									x: { velocity: 5 * this.direction,  min: 0, max: 0 },
									rotation: { velocity: 2 * this.direction,  min: 0, max: 0 },
								}
							});

							gsap.to(".our-apps-card_ll .our-apps-card__object_1", {
								inertia: {
									y: { velocity: -10,  min: 0, max: 0 },
									rotationY: { velocity: 20,  min: 0, max: 0 },
								}
							});
							gsap.to(".our-apps-card_ll .our-apps-card__object_2", {
								inertia: {
									y: { velocity: -10,  min: 0, max: 0 },
									rotationY: { velocity: -20,  min: 0, max: 0 },
								}
							});
							gsap.to(".our-apps-card_ll .our-apps-card__object_3", {
								inertia: {
									y: { velocity: -10,  min: 0, max: 0 },
								}
							});

							gsap.to(".our-apps-card_bbt .our-apps-card__object_2", {
								inertia: {
									y: { velocity: -10,  min: 0, max: 0 },
									rotation: { velocity: 5 * this.direction,  min: 0, max: 0 },
								}
							});
						}, 25)
				});
				this.scrollTrigger = ScrollTrigger.create({
					trigger: "#apps",
					start: "top top",
					end: "bottom bottom",
					onUpdate: self => {
						const position = Math.min(this.lastPositionIdx, Math.floor(self.progress * this.slides.length));
						if (this.lastPosition === position) return;
						this.direction = this.lastPosition < position ? 1 : -1;
						this.lastPosition = position;
						this.slideTween(calcPath(position));
					}
				});
			} else {
				Observer.create({
					target: window, // can be any element (selector text is fine)
					type: "scroll", // comma-delimited list of what to listen for ("wheel,touch,scroll,pointer")
					onChangeY: throttle((self) => {
							gsap.to(".our-apps-card_mt .our-apps-card__object_5 img, .our-apps-card_mt .our-apps-card__object_4 img", {
								inertia: {
									x: { velocity: Math.sign(self.deltaY) * -5,  min: 0, max: 0 },
									rotation: { velocity: Math.sign(self.deltaY) * -2,  min: 0, max: 0 },
								}
							});
							gsap.to(".our-apps-card_mt .our-apps-card__object_1 img", {
								inertia: {
									y: { velocity: Math.sign(self.deltaY) * -5,  min: 0, max: 0 },
								}
							});

							gsap.to(".our-apps-card_bt .our-apps-card__object_5 img, .our-apps-card_bt .our-apps-card__object_4 img", {
								inertia: {
									y: { velocity: Math.sign(self.deltaY) * -5,  min: 0, max: 0 },
								}
							});

							gsap.to(".our-apps-card_ll .our-apps-card__object_1", {
								inertia: {
									y: { velocity: Math.sign(self.deltaY) * -5,  min: 0, max: 0 },
									rotationY: { velocity: Math.sign(self.deltaY) * -10,  min: 0, max: 0 },
								}
							});
							gsap.to(".our-apps-card_ll .our-apps-card__object_2", {
								inertia: {
									y: { velocity: Math.sign(self.deltaY) * -5,  min: 0, max: 0 },
									rotationY: { velocity: Math.sign(self.deltaY) * -10,  min: 0, max: 0 },
								}
							});
							gsap.to(".our-apps-card_ll .our-apps-card__object_3", {
								inertia: {
									y: { velocity: Math.sign(self.deltaY) * -5,  min: 0, max: 0 },
								}
							});

							gsap.to(".our-apps-card_bbt .our-apps-card__object_1, .our-apps-card_bbt .our-apps-card__object_2", {
								inertia: {
									y: { velocity: Math.sign(self.deltaY) * -5,  min: 0, max: 0 },
								}
							});
						}
						, 25)
				});
			}
		});
	}
}
new OurAppsAnimation();

class OurPhilosophyAnimation {
	constructor() {
		this.slides = document.querySelectorAll("#apps .our-apps-card");
		this.body = document.querySelector("#apps .our-apps__body");
		this.init();
	}
	init () {
		if (false) return; // Animation disabled (start not from the top or already animated);
		console.log('OurAppsAnimation');
		this.rebuildAnimations();
		// window.app.windowResizeObserver.on("resize", () => this.onResize());
		// this.onResize();
	}
	// onResize() {
	// 	this.rebuildAnimations();
	// }
	rebuildAnimations() {
		const self = this;
		this.context?.revert();
		this.context = gsap.context(() => {
			Observer.create({
				target: window, // can be any element (selector text is fine)
				type: "scroll", // comma-delimited list of what to listen for ("wheel,touch,scroll,pointer")
				onChangeY: throttle((self) => {
						gsap.to(".our-philosophy__char_archer img", {
							inertia: {
								rotation: { velocity: Math.sign(self.deltaY) * 3,  min: 0, max: 0 },
							}
						});
						gsap.to(".our-philosophy__char_fish .fish-char", {
							inertia: {
								rotation: { velocity: Math.sign(self.deltaY) * 3,  min: 0, max: 0 },
							}
						});
						gsap.to(".our-philosophy__char_fish .fish-char__hand_bot", {
							transformOrigin: "left top",
							inertia: {
								rotation: { velocity: Math.sign(self.deltaY) * 4,  min: 0, max: 0 },
							}
						});
						gsap.to(".our-philosophy__char_fish .fish-char__hand_top", {
							transformOrigin: "left bottom",
							inertia: {
								rotation: { velocity: Math.sign(self.deltaY) * 8,  min: 0, max: 0 },
							}
						});

						gsap.to(".our-philosophy__char_owl .owl-char", {
							inertia: {
								rotation: { velocity: Math.sign(self.deltaY) * 3,  min: 0, max: 0 },
							}
						});
						gsap.to(".our-philosophy__char_owl .owl-char__head", {
							inertia: {
								rotation: { velocity: Math.sign(self.deltaY) * 6,  min: 0, max: 0 },
							}
						});
						gsap.to(".our-philosophy__char_owl .owl-char__wings", {
							transformOrigin: "right bottom",
							inertia: {
								rotation: { velocity: Math.sign(self.deltaY) * 6,  min: 0, max: 0 },
							}
						});

						gsap.to(".philosophy-info", {
							inertia: {
								y: { velocity: Math.sign(self.deltaY) * 10,  min: 0, max: 0 },
							}
						});
					}
					, 25)
			});
		});
	}
}
if(document.querySelector("#apps")) new OurPhilosophyAnimation();

class OurTeamAnimation {
	constructor() {
		this.root = document.querySelector("#team");
		this.text = document.querySelector(".our-team__text");
		this.init();
	}
	init () {
		if (false) return; // Animation disabled (start not from the top or already animated);
		console.log('OurTeamAnimation');
		window.app.windowResizeObserver.on("resize", () => this.onResize());
		this.onResize();
	}
	onResize() {
		this.rebuildAnimations();
	}
	rebuildAnimations() {
		this.root.style.setProperty("--min-height", `${150 + this.text.scrollHeight / this.text.offsetHeight * 100 - 100}vh`);
		this.context?.revert();
		this.context = gsap.context(() => {
			this.tl = gsap.timeline({
				scrollTrigger: {
					trigger: "#team",
					scrub: true,
					start: "top top",
					end: "bottom bottom",
					onUpdate: (self) => {
						this.text.scrollTo({ top: (this.text.scrollHeight - this.text.offsetHeight) * self.progress });
					}
				}
			});
			this.tl.to(".team-animation__big-gear", { rotation: 115, transformOrigin: "center" });
			this.tl.to(".team-animation__middle-gear", { rotation: 115, transformOrigin: "center" }, "<");
			this.tl.to(".team-animation__small-gear", { rotation: -115, transformOrigin: "center" }, "<");

			this.tl.to(".team-animation__drop_1", { x: -40, y: -40, transformOrigin: "center" }, "<");
			this.tl.to(".team-animation__drop_2", { x: -10, y: -30, transformOrigin: "center" }, "<");
			this.tl.to(".team-animation__drop_3", { x: -30, y: -30, transformOrigin: "center" }, "<");
			this.tl.to(".team-animation__drop_4", { x: -40, y: 30, transformOrigin: "center" }, "<");
			this.tl.to(".team-animation__drop_5", { x: -10, y: 30, transformOrigin: "center" }, "<");
			this.tl.to(".team-animation__drop_6", { x: 20, y: 40, transformOrigin: "center" }, "<");
			this.tl.to(".team-animation__drop_7", { x: 10, y: 40, transformOrigin: "center" }, "<");
			this.tl.to(".team-animation__drop_8", { x: 40, y: 10, transformOrigin: "center" }, "<");
			this.tl.to(".team-animation__drop_9", { x: 40, y: -50, transformOrigin: "center" }, "<");
		});
	}
}

if(document.querySelector("#team")) new OurTeamAnimation();

// Обновляем при изменении размеров экрана
window.addEventListener('resize', setViewportHeight);

document.documentElement.classList.add("is-initialised");


// Функция проверки хэша в URL и прокрутки к нужному блоку
function scrollToHash() {
	const hash = window.location.hash;
	if (hash) {
		const targetSection = document.querySelector(hash);
		if (targetSection) {
			scrollToSection(targetSection);
		}
	}
}

// Запускаем функцию при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
	scrollToHash();
});

document.addEventListener('DOMContentLoaded', function () {
	document.addEventListener('wpcf7submit', function () {
		console.log('wpcf7submit');

		let messages = document.querySelectorAll('.wpcf7-response-output');
console.log('messages', messages);
		messages.forEach(message => {
			message.style.opacity = '1';
			message.style.transition = 'opacity 1s';

			// Скрываем сообщение через 10 секунд
			setTimeout(() => {
				message.style.opacity = '0';
			}, 10000);
		});
	});

	// При каждом новом сообщении снова делаем его видимым
	document.addEventListener('wpcf7invalid', () => resetMessage());
	document.addEventListener('wpcf7spam', () => resetMessage());
	document.addEventListener('wpcf7mailsent', () => resetMessage());
	document.addEventListener('wpcf7mailfailed', () => resetMessage());

	function resetMessage() {
		let messages = document.querySelectorAll('.wpcf7-response-output');

		messages.forEach(message => {
			message.style.opacity = '1';
		});
	}
});


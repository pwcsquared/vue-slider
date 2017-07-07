Vue.component("slide-component",{
	template: '<div class="slide"></div>'
});

Vue.component("arrow-component",{
	template: '<div class="arrow" v-on:click="slide"><h1>&ltrif;</h1></div>',
	methods: {
		slide: function(){
			var direction = this.$el.classList.value.match(/right|left/);
			this.$emit('shift',direction[0]);
		}
	}
});

var app = new Vue({
	el: "#app",
	data: {},
	mounted: function(){
		window.addEventListener('resize',this.resetSlides);
	},
	methods: {
		getDistance: function(carouselPos,dir){
			var rightEdge = carouselPos.right;
			var finalSlideEdge = this.$children[this.$children.length - 1].$el.getBoundingClientRect().right;

			for (var i = 2; i < this.$children.length; i++){
				if (dir === "right"){
					var slideLeft = this.$children[i].$el.getBoundingClientRect().left;
					//check to see how close last child is to edge of carousel, cap return value by that distance
					if (Math.round(slideLeft - carouselPos.left) === 0){
						var leftSlideWidth = this.$children[i].$el.offsetWidth;
						var rightSlideGap = finalSlideEdge - rightEdge;
						if (rightSlideGap < leftSlideWidth){
							return rightSlideGap;
						} else {
							return leftSlideWidth;
						}
					}
				} else if (dir === "left"){
					var slideRight = this.$children[i].$el.getBoundingClientRect().right;
					if (Math.round(slideRight - carouselPos.left) === 0){
						return -(this.$children[i].$el.offsetWidth);
					} else if (slideRight - carouselPos.left > 0){
						return -(this.$children[i].$el.offsetWidth - (slideRight - carouselPos.left));
					}
				}
			}
		},

		slideChildren: function(direction){

			var carouselPosX = this.$el.getBoundingClientRect();
			var shiftDistance = this.getDistance(carouselPosX,direction);

			for(var i = 2; i < this.$children.length; i++){
				var currentPos = this.$children[i].$el.style.transform;
				if (currentPos){
					var digits = currentPos.match(/-?\d+/);
					this.$children[i].$el.style.transform = "translateX(" + (digits - shiftDistance) + "px)";
				} else {
					this.$children[i].$el.style.transform = "translateX(" + (-shiftDistance) + "px)";
				}
			}
		},

		resetSlides: function(evt){
			for (var i = 2; i < this.$children.length; i++){
				this.$children[i].$el.style.transform = "translateX(0px)";
			}
		}
	},
});

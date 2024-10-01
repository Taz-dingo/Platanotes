"use client";

import { useEffect } from "react";

export default function FallingLeaves() {
  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.id = "fallingLeaves";
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.zIndex = "-1";
    document.body.prepend(canvas);

    const script = document.createElement("script");
    script.innerHTML = `
      new Processing(document.getElementById('fallingLeaves'), function(p) {
        var leaves = [];
        
        p.setup = function() {
          p.size(window.innerWidth, window.innerHeight);
          for (var i = 0; i < 50; i++) {
            leaves.push(new Leaf());
          }
        };
        
        p.draw = function() {
          p.background(255, 255, 255, 10);
          for (var i = 0; i < leaves.length; i++) {
            leaves[i].fall();
            leaves[i].display();
          }
        };
        
        function Leaf() {
          this.x = p.random(p.width);
          this.y = p.random(-100, -10);
          this.z = p.random(0, 20);
          this.size = p.map(this.z, 0, 20, 10, 30);
          this.yspeed = p.map(this.z, 0, 20, 1, 4);
          this.xspeed = p.random(-1, 1);
          
          this.fall = function() {
            this.y += this.yspeed;
            this.x += this.xspeed;
            if (this.y > p.height) {
              this.y = p.random(-100, -10);
              this.x = p.random(p.width);
            }
          };
          
          this.display = function() {
            p.fill(139, 69, 19, 150);
            p.noStroke();
            p.ellipse(this.x, this.y, this.size, this.size);
          };
        }
      });
    `;
    document.body.appendChild(script);

    return () => {
      const canvas = document.getElementById("fallingLeaves");
      if (canvas) {
        canvas.remove();
      }
      script.remove();
    };
  }, []);

  return null;
}

'use client'
import React from 'react'
import NativeUglyDogGame from './NativeUglyDogGame'

export default function UglyDogGameSection() {
  return (
    <>
      <section className="tf-section project">
        <div className="overlay"></div>
        <div className="container w_1280">
          <div className="row">
            <div className="col-md-12">
              <div className="tf-title" data-aos="fade-up" data-aos-duration={800}>
                <h2 className="title">
                  🐕 UglyDog Clicker Game
                </h2>
                <p className="sub">
                  Click the UglyDog to score points and watch it evolve! Complete game experience built into the template.
                </p>
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-md-12">
              {/* Native Game Component - Full Width */}
              <div data-aos="fade-up" data-aos-duration={1000}>
                <NativeUglyDogGame />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

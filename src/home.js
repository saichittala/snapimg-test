import React from 'react'
import OptionsGrid from './components/card-grid';


function Home() {
  return (
    <div>

      <main>
        <section>
          <div>
            <h1>Free Online Image Compression & Conversion Tool</h1>
            <p className="heading-desc">
              Compress images and convert JPG, PNG, WebP files easily. No downloads, no quality loss!
            </p>
          </div>

          <OptionsGrid />
        </section>
        <div className="bg-white">


          <section className="common-padding">
            <h2>Why Choose SnapIMG?</h2>
            <div className="why-choose-grid">
              <div className="why-choose-item">
                <img className="options-icon" src="/img/correct.svg" alt="No Software Required" />
                <div>
                  <h3>Fast & Free Image Compression</h3>
                  <p>Reduce file size while maintaining quality.</p>
                </div>
              </div>
              <div className="why-choose-item">
                <img className="options-icon" src="/img/correct.svg" alt="No Software Required" />
                <div>
                  <h3>Convert Between JPG, PNG, WebP</h3>
                  <p>Simple and efficient format conversion.</p>
                </div>
              </div>
              <div className="why-choose-item">
                <img className="options-icon" src="/img/correct.svg" alt="No Software Required" />
                <div>
                  <h3>Secure & Private</h3>
                  <p>Your images are processed instantly in your browser.</p>
                </div>
              </div>
              <div className="why-choose-item">
                <img className="options-icon" src="/img/correct.svg" alt="No Software Required" />
                <div>
                  <h3>No Software Required</h3>
                  <p>Works 100% online, no downloads needed.</p>
                </div>
              </div>

            </div>
          </section>
        </div>

        <section className="common-padding">
          <div className="how-to-use-container">
            <h2>How to Use SnapIMG?</h2>
            <div className="how-to-use-grid">
              <div className="how-to-use-item">
                <img className="options-icon" src="/img/how-upload.svg" alt="Upload Image" />
                <div>
                  <h3>Upload Image</h3>
                  <p>Choose your JPG, PNG, or WebP file to compress or convert.</p>
                </div>
              </div>
              <div className="how-to-use-item">
                <img className="options-icon" src="/img/how-compress.svg" alt="Compress Image" />
                <div>
                  <h3>Compress or Convert</h3>
                  <p>Select the desired action to optimize your image.</p>
                </div>
              </div>
              <div className="how-to-use-item">
                <img className="options-icon" src="/img/how-download.svg" alt="Download Image" />
                <div>
                  <h3>Download Image</h3>
                  <p>Get your optimized image instantly.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="bg-gradient">
          <section className="common-padding">
            <div className="readable-grid-container">
              <div className="readable-container">
                <h2 className="readable-heading">Convert Image Formats Easily</h2>
                <p className="readable-text">Convert JPG to PNG, PNG to JPG, JPG to WebP, or PNG to WebP in just a few clicks. SnapIMG supports bulk conversion and ensures high-quality results.</p>
              </div>
              <div className="readable-container">
                <h2 className="readable-heading">Compress Images Online for Free</h2>
                <p className="readable-text">SnapIMG allows you to compress images online without losing quality. Whether you need to reduce the size of JPG, PNG, or WebP files, our tool ensures fast compression.</p>
              </div>
            </div>
          </section>
        </div>
      </main>

    </div>

  )
}

export default Home

import React from 'react'

function Footer() {
  return (
    <footer>
      <div className="footer-main">
        <div className="footer-sub">
          <a href="/">
            <img src="img/logo.svg" alt="SnapIMG - Free Online Image Compression and Conversion Tool"/>
          </a>
          <p className="footer-text">Compress & Convert Images Online (JPG, PNG, WebP)</p>
        </div>
        <div className="footer-sub">
          <a className="footer-link" href="/privacy-policy.html">Privacy Policy</a>
          <a className="footer-link" href="/terms.html">Terms of Use</a>
        </div>


      </div>
      <p className="copyrights-text">&copy; 2025 SnapIMG. All rights reserved. </p>

    </footer>
  )
}

export default Footer

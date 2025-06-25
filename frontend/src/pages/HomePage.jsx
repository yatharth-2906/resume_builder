import Scroll from './Scroll';
import { Link } from 'react-router-dom';
import styles from './styles/Homepage.module.css';

const Homepage = () => {
    return (
        <div className={styles.container}>
            {/* Header Section */}
            <header className={styles.header}>
                <div className={styles.logo}>
                    <h1>ResumeCraft Pro</h1>
                    <p>Build Professional Resumes with LaTeX Precision</p>
                </div>
                <nav className={styles.nav}>
                    <Scroll id="features">Features</Scroll>
                    <Scroll id="templates">Templates</Scroll>
                    <Scroll id="how-it-works">How It Works</Scroll>
                    <button className={styles.ctaButton} onClick={()=> window.location.href='/login'}>Get Started</button>
                </nav>
            </header>

            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h2>Craft Your Perfect Resume with LaTeX Elegance</h2>
                    <p>
                        Create ATS-friendly, professionally typeset resumes with our easy-to-use
                        LaTeX template builder. No technical skills required!
                    </p>
                    <div className={styles.heroButtons}>
                        <button className={styles.primaryButton}>Try It Now</button>
                        <button className={styles.secondaryButton}>View Templates</button>
                    </div>
                </div>
                <div className={styles.heroImage}>
                    <img src="/resume-preview.png" alt="Resume Preview" />
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className={styles.features}>
                <h2>Powerful Features</h2>
                <div className={styles.featuresGrid}>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>📄</div>
                        <h3>ATS-Optimized Templates</h3>
                        <p>
                            Our LaTeX templates are designed to pass through Applicant Tracking
                            Systems while maintaining beautiful typography and layout.
                        </p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>🔗</div>
                        <h3>Sharable Resume Links</h3>
                        <p>
                            Generate a unique URL for your resume that you can share with
                            recruiters or include in your LinkedIn profile.
                        </p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>🎨</div>
                        <h3>Customizable Designs</h3>
                        <p>
                            Easily switch between multiple color schemes and font combinations
                            without touching LaTeX code.
                        </p>
                    </div>
                </div>
            </section>

            {/* Templates Section */}
            <section id="templates" className={styles.templates}>
                <h2>Beautiful LaTeX Templates</h2>
                <p className={styles.sectionSubtitle}>
                    Choose from our collection of professionally designed templates
                </p>
                <div className={styles.templateGallery}>
                    <div className={styles.templateCard}>
                        <img src="/template-modern.png" alt="Modern Template" />
                        <h3>Modern</h3>
                        <p>Clean lines and contemporary design</p>
                    </div>
                    <div className={styles.templateCard}>
                        <img src="/template-classic.png" alt="Classic Template" />
                        <h3>Classic</h3>
                        <p>Traditional layout with timeless appeal</p>
                    </div>
                    <div className={styles.templateCard}>
                        <img src="/template-executive.png" alt="Executive Template" />
                        <h3>Executive</h3>
                        <p>Sophisticated design for senior roles</p>
                    </div>
                    <div className={styles.templateCard}>
                        <img src="/template-creative.png" alt="Creative Template" />
                        <h3>Creative</h3>
                        <p>For designers and artistic professionals</p>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className={styles.howItWorks}>
                <h2>How It Works</h2>
                <div className={styles.steps}>
                    <div className={styles.step}>
                        <div className={styles.stepNumber}>1</div>
                        <div className={styles.stepContent}>
                            <h3>Select a Template</h3>
                            <p>
                                Choose from our collection of ATS-friendly LaTeX resume templates.
                            </p>
                        </div>
                    </div>
                    <div className={styles.step}>
                        <div className={styles.stepNumber}>2</div>
                        <div className={styles.stepContent}>
                            <h3>Fill in Your Details</h3>
                            <p>
                                Use our intuitive form to enter your work experience, education,
                                and skills.
                            </p>
                        </div>
                    </div>
                    <div className={styles.step}>
                        <div className={styles.stepNumber}>3</div>
                        <div className={styles.stepContent}>
                            <h3>Download or Share</h3>
                            <p>
                                Download the PDF or share via a unique URL with recruiters.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <footer className={styles.footer}>
                <div className={styles.footerBottom}>
                    <p className={styles.footerText}>Made with ❤️ by Yatharth</p>
                </div>
            </footer>
        </div>
    );
};

export default Homepage;
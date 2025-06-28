import Scroll from './Scroll';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import styles from './styles/HomePage.module.css';

const Homepage = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user")) || null;

    const ScrollTo = (id) => {
        const element = document.getElementById(id);
        element?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSignOut = () => {
        Cookies.remove('token');
        localStorage.removeItem("user");
        window.location.reload();
    }

    return (
        <div className={styles.container}>
            {/* Header Section */}
            <header className={styles.header}>
                <div className={styles.logo}>
                    <h1>ResumeCraft Pro</h1>
                    <p>
                        {user ? (
                            <>Welcome, <strong>{user.user_name}</strong>! Build Professional Resumes with high ATS Score</>
                        ) : (
                            <>Build Professional Resumes with high ATS Score</>
                        )}
                    </p>

                </div>
                <nav className={styles.nav}>
                    <Scroll id="features">Features</Scroll>
                    <Scroll id="templates">Templates</Scroll>
                    <Scroll id="how-it-works">How It Works</Scroll>
                    {user ?
                        <button className={styles.signOutButton}
                            onClick={handleSignOut}>Sign Out</button> :
                        <button className={styles.ctaButton}
                            onClick={() => navigate('/login')}>Login</button>}
                </nav>
            </header>

            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h2>Craft Your Perfect Resume with LaTeX Elegance</h2>
                    <p>
                        Build clean, ATS friendly resumes using our powerful yet easy to use Resume builder.
                        Designed for professionals, students and job seekers alike, our tool ensures your resume
                        looks polished and well formatted.
                    </p>
                    <div className={styles.heroButtons}>
                        {user ? <></> : <button className={styles.primaryButton} onClick={() => navigate('/signup')}>Try It Now</button>}
                        <button className={styles.secondaryButton} onClick={() => ScrollTo('templates')}>View Templates</button>
                    </div>
                </div>
                <div className={styles.heroImage}>
                    <img src="/resume_template1.png" alt="Resume Preview" />
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className={styles.features}>
                <h2>Powerful Features</h2>
                <div className={styles.featuresGrid}>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>📄</div>
                        <h3>ATS Optimized Templates</h3>
                        <p>
                            Our resume templates are optimized to achieve high scores with Applicant Tracking Systems, ensuring both compatibility and a polished, professional appearance.
                        </p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>🔗</div>
                        <h3>Sharable Resume Links</h3>
                        <p>
                            Generate a shareable URL for your resume that can be easily sent to recruiters, added to your LinkedIn profile or included in job applications to showcase your skills.
                        </p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>🎨</div>
                        <h3>Customizable Designs</h3>
                        <p>
                            Choose from a variety of professionally designed resume templates tailored for different roles and industries. You can easily select a template that fits your profile.
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
                    <div className={styles.templateCard} onClick={() => navigate('/editor?fileName=template1.tex')} style={{ cursor: 'pointer' }}>
                        <img src="/resume_template1.png" alt="Modern Template" />
                        <h3>Modern</h3>
                        <p>Clean lines and contemporary design</p>
                    </div>
                    <div className={styles.templateCard} onClick={() => navigate('/editor?fileName=template2.tex')} style={{ cursor: 'pointer' }}>
                        <img src="/resume_template2.png" alt="Classic Template" />
                        <h3>Classic</h3>
                        <p>Traditional layout with timeless appeal</p>
                    </div>
                    <div className={styles.templateCard} onClick={() => navigate('/editor?fileName=template3.tex')} style={{ cursor: 'pointer' }}>
                        <img src="/resume_template3.png" alt="Executive Template" />
                        <h3>Executive</h3>
                        <p>Sophisticated design for senior roles</p>
                    </div>
                    <div className={styles.templateCard} onClick={() => navigate('/editor?fileName=template4.tex')} style={{ cursor: 'pointer' }}>
                        <img src="/resume_template4.png" alt="Creative Template" />
                        <h3>Creative</h3>
                        <p>For designers and artistic professionals</p>
                    </div>
                    <div className={styles.templateCard} onClick={() => navigate('/editor?fileName=template5.tex')} style={{ cursor: 'pointer' }}>
                        <img src="/resume_template5.png" alt="Minimalist Template" />
                        <h3>Minimalist</h3>
                        <p>Focused layout with clean whitespace</p>
                    </div>
                    <div className={styles.templateCard} onClick={() => navigate('/editor?fileName=template6.tex')} style={{ cursor: 'pointer' }}>
                        <img src="/resume_template6.png" alt="Professional Template" />
                        <h3>Professional</h3>
                        <p>Perfect balance of structure and readability</p>
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
                                Choose from our collection of ATS friendly Resume Templates.
                            </p>
                        </div>
                    </div>
                    <div className={styles.step}>
                        <div className={styles.stepNumber}>2</div>
                        <div className={styles.stepContent}>
                            <h3>Fill in Your Details</h3>
                            <p>
                                Use our intuitive platform to enter your work experience, education,
                                and skills.
                            </p>
                        </div>
                    </div>
                    <div className={styles.step}>
                        <div className={styles.stepNumber}>3</div>
                        <div className={styles.stepContent}>
                            <h3>Download or Share</h3>
                            <p>
                                Download the PDF of your resume or share it using a unique URL with recruiters.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <footer className={styles.footer}>
                <div className={styles.footerBottom}>
                    <a className={styles.footerText} href='https://github.com/yatharth-2906/resume_builder' target='__blank'>Made with ❤️ by Yatharth</a>
                </div>
            </footer>
        </div>
    );
};

export default Homepage;
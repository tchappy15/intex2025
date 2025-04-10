import './PrivacyPage.css';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';






const PrivacyPage = () => {
  const navigate = useNavigate();

    useEffect(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

  return (
    <>
    <Link to='/'>
      <img
        className="privacy-img"
        src="src/assets/CineNicheFull.png"
        alt="CineNiche Film Camera Logo"
      />
    </Link>
    <div className="privacy-div">
        <button
          onClick={() => navigate('/')}
          className="sticky-btn custom-rounded"
          type="button"
          >
            Back
        </button>
        <h1 className="privacy-h1">Privacy Policy – CineNiche</h1>
        
        <div className="privacy-meta">
          <p>Effective Date: 11 April 2025</p>
          <p>Last Updated: 11 April 2025</p>
        </div>

        <section>
          <p className="privacy2-section mb-4">
            At CineNiche, your privacy is important to us. This Privacy Policy
            outlines how we collect, use, store, and protect your personal
            information in accordance with the General Data Protection
            Regulation (GDPR).
          </p>
        </section>

        <section className="privacy-section mb-6">
          <h2 className="text-xl font-semibold mb-2">1. Data We Collect</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Full name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Age</li>
            <li>Gender</li>
            <li>City, state, and ZIP/postal code</li>
            <li>The ratings of movies you review and your reviews</li>
            <li>Your Watch History</li>
            <li>Your Watch List</li>
          </ul>
        </section>

        <section className="privacy-section mb-6">
          <h2 className="text-xl font-semibold mb-2">
            2. Purpose of Data Collection
          </h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Provide you with personalized media recommendations</li>
            <li>Improve our service offerings and user experience</li>
            <li>
              Communicate important updates and offers (with your consent)
            </li>
            <li>
              Perform internal analytics and usage tracking (anonymized when
              possible)
            </li>
          </ul>
        </section>

        <section className="privacy-section mb-6">
          <h2 className="text-xl font-semibold mb-2">
            3. Legal Basis for Processing
          </h2>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <strong>Consent</strong> – You grant us permission to collect and
              process your data by using our platform and accepting this policy.
            </li>
            <li>
              <strong>Legitimate interest</strong> – We use your data to enhance
              and personalize the service you receive from CineNiche.
            </li>
            <li>
              <strong>Contractual necessity</strong> – For subscribed users,
              data may also be used to deliver services agreed upon in a paid
              subscription.
            </li>
          </ul>
        </section>

        <section className="privacy-section mb-6">
          <h2 className="text-xl font-semibold mb-2">
            4. Data Storage and Security
          </h2>
          <p>
            All personal data is securely stored in a protected database with
            access limited to authorized personnel only. We implement
            appropriate technical and organizational measures to protect your
            data from unauthorized access, loss, or misuse.
          </p>
        </section>

        <section className="privacy-section mb-6">
          <h2 className="text-xl font-semibold mb-2">
            5. User Rights (under GDPR)
          </h2>
          <p className="mb-2">As a user, you have the right to:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Access your personal data</li>
            <li>Request correction or deletion of your data</li>
            <li>Withdraw consent at any time</li>
            <li>Object to or restrict certain types of data processing</li>
            <li>Request data portability</li>
          </ul>
          <p className="mt-2">
            To exercise any of these rights, contact us at Privacy@CineNiche.com
          </p>
        </section>

        <section className="privacy-section mb-6">
          <h2 className="text-xl font-semibold mb-2">
            6. Third Parties and Data Sharing
          </h2>
          <p>
            We do not sell your data. Your data may only be shared with
            third-party service providers that help us deliver features (e.g.,
            hosting, analytics), and only under strict data protection
            agreements.
          </p>
        </section>

        <section className="privacy-section mb-6">
          <h2 className="text-xl font-semibold mb-2">7. Data Retention</h2>
          <p>
            We retain your data for as long as your account is active or as
            needed to provide you with our services. You may request deletion at
            any time.
          </p>
        </section>

        <section className="privacy-section mb-6">
          <h2 className="text-xl font-semibold mb-2">
            8. Disclaimer of Liability for Non-Subscribers
          </h2>
          <p>
            While we take reasonable steps to protect all user data, CineNiche
            is not legally obligated to offer compensation in the event of a
            data breach unless you are a paid subscriber under contractual
            terms. All users are encouraged to consider the level of data they
            share on the platform.
          </p>
        </section>

        <section className="privacy-section mb-6">
          <h2 className="text-xl font-semibold mb-2">9. Policy Updates</h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes
            will be posted on this page with the new effective date.
          </p>
        </section>

        <section className="privacy-section mb-6">
          <h2 className="text-xl font-semibold mb-2">10. Contact Us</h2>
          <p>
            If you have any questions or concerns about this policy or how we
            handle your data, please reach out to: Privacy@CineNiche.com
          </p>
        </section>
      </div>
    </>
  );
};

export default PrivacyPage;

import PolicyLayout from '../components/PolicyLayout';
import { SITE_EMAIL } from '../constants/site';

const PrivacyPolicy = () => (
  <PolicyLayout
    title="Privacy Policy"
    subtitle="How Visheshkala collects, uses, and protects your information when you browse, enquire, or order from our studio."
  >
    <section>
      <h2 className="font-serif text-xl text-ghibli-charcoal mb-3">Who we are</h2>
      <p>
        Visheshkala is a handmade art studio founded by Vishakha Garg, based in India. When you use our website,
        contact form, cart checkout, newsletter, or chatbot, we may collect personal information to respond to your
        enquiry or fulfil an order.
      </p>
    </section>

    <section>
      <h2 className="font-serif text-xl text-ghibli-charcoal mb-3">Information we collect</h2>
      <ul className="list-disc pl-5 space-y-2">
        <li><strong>Contact &amp; enquiries:</strong> name, email, subject, and message when you use our contact form or chatbot.</li>
        <li><strong>Orders:</strong> name, phone, email, shipping address, and cart items when you submit checkout.</li>
        <li><strong>Newsletter:</strong> email address if you subscribe to updates.</li>
        <li><strong>Technical data:</strong> basic analytics (page views, device type) via Google Analytics, if enabled.</li>
      </ul>
    </section>

    <section>
      <h2 className="font-serif text-xl text-ghibli-charcoal mb-3">How we use your information</h2>
      <ul className="list-disc pl-5 space-y-2">
        <li>To respond to commissions, custom artwork requests, and order enquiries.</li>
        <li>To process and deliver orders placed through our website or WhatsApp.</li>
        <li>To send studio updates if you opt in to our newsletter.</li>
        <li>To improve our website and understand how visitors use the shop and gallery.</li>
      </ul>
      <p className="mt-3">We do not sell your personal data to third parties.</p>
    </section>

    <section>
      <h2 className="font-serif text-xl text-ghibli-charcoal mb-3">Data storage &amp; security</h2>
      <p>
        Enquiries and orders are stored securely in our database (Supabase). Email notifications are sent via Resend.
        We retain order and enquiry records as long as needed for customer service and legal compliance.
      </p>
    </section>

    <section>
      <h2 className="font-serif text-xl text-ghibli-charcoal mb-3">Your rights</h2>
      <p>
        You may request access, correction, or deletion of your personal data by emailing{' '}
        <a href={`mailto:${SITE_EMAIL}`} className="text-ghibli-wood font-semibold hover:underline">{SITE_EMAIL}</a>{' '}
        or reaching us via our{' '}
        <a href="/contact" className="text-ghibli-wood font-semibold hover:underline">contact page</a>.
      </p>
    </section>

    <section>
      <h2 className="font-serif text-xl text-ghibli-charcoal mb-3">Cookies &amp; analytics</h2>
      <p>
        We may use cookies and Google Analytics to understand site traffic. You can disable cookies in your browser settings.
        Cart and wishlist items are stored locally in your browser until you clear them.
      </p>
    </section>

    <section>
      <h2 className="font-serif text-xl text-ghibli-charcoal mb-3">Contact</h2>
      <p>
        Questions about this policy? Write to{' '}
        <a href={`mailto:${SITE_EMAIL}`} className="text-ghibli-wood font-semibold hover:underline">{SITE_EMAIL}</a>.
      </p>
    </section>
  </PolicyLayout>
);

export default PrivacyPolicy;

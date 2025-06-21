import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <h1>About Us</h1>
      <p>
        At <strong>DabbaBites</strong>, we believe food is a blessing, not a waste. That’s why we follow a strict <strong>“No Food Wastage”</strong> policy. We’ve partnered with cloud kitchens to ensure that any surplus food at the end of the day is donated to NGOs working to fight hunger in Kolkata.
      </p>

      <h2>✨ Our Partner NGOs</h2>
      <ul>
        <li>
          <strong>Feeding Kolkata</strong> – Serving nutritious meals daily to homeless communities and street children across the city.
        </li>
        <li>
          <strong>Missionaries of Charity</strong> – Founded by Mother Teresa, supporting the underprivileged with food, care, and dignity.
        </li>
        <li>
          <strong>Hope Kolkata Foundation</strong> – Empowering vulnerable children and families through education, healthcare, and food support.
        </li>
      </ul>

      <p>
        We are also committed to sustainability. Our deliveries are made using <strong>eco-friendly e-bikes and e-bicycles</strong> to reduce carbon emissions.
      </p>

      <p>
        Through our <strong>“Green Start”</strong> initiative, every new user receives a complimentary plant with their first order. Additionally, we plant a tree on behalf of each new customer — a small step toward a greener tomorrow.
      </p>

      <p>
        With DabbaBites, you’re not just eating better — you're <strong>impacting lives and healing the planet</strong> with every meal. 💚
      </p>
    </div>
  );
};

export default AboutUs;

export default function Tickets() {
  return (
    <div>
      <h2>Support Tickets</h2>
      <p>(Integrate with ticket system or show open/assigned tickets here.)</p>
      <ul>
        <li>Ticket #1337 - "Unable to branch production" - Team: acme</li>
        <li>
          Ticket #1982 - "Billing failed (Razorpay)" - User: user2@xyz.com
        </li>
      </ul>
      <button style={{ marginTop: 8 }}>Triage / Assign</button>
    </div>
  );
}

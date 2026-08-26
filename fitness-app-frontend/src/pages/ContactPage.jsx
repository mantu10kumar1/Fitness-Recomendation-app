const ContactPage = () => (
  <div className="max-w-md mx-auto py-16 px-4">
    <h1 className="text-2xl font-bold text-white mb-4 text-center">Contact Support</h1>
    <form className="space-y-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
      <input type="text" placeholder="Your Name" className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white text-sm focus:outline-cyan-500" />
      <input type="email" placeholder="Your Email" className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white text-sm focus:outline-cyan-500" />
      <textarea rows="4" placeholder="Your Message" className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white text-sm focus:outline-cyan-500"></textarea>
      <button type="button" className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg transition text-sm">Send Message</button>
    </form>
  </div>
);
export default ContactPage;
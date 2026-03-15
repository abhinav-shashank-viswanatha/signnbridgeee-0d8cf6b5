import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border bg-card/50">
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">S</span>
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">SignBridge</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Breaking communication barriers with AI-powered translation between speech, text, and sign language.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-4">Platform</h4>
          <ul className="space-y-2.5">
            {["Features", "Demo", "Technology"].map((item) => (
              <li key={item}>
                <Link to={`/${item.toLowerCase()}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-4">Use Cases</h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li>Healthcare</li>
            <li>Education</li>
            <li>Government</li>
            <li>Daily Life</li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-4">Contact</h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li>hello@signbridge.ai</li>
            <li>San Francisco, CA</li>
          </ul>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-xs text-muted-foreground">© 2026 SignBridge. All rights reserved.</p>
        <div className="flex gap-6 text-xs text-muted-foreground">
          <span className="hover:text-primary cursor-pointer transition-colors">Privacy</span>
          <span className="hover:text-primary cursor-pointer transition-colors">Terms</span>
          <span className="hover:text-primary cursor-pointer transition-colors">Accessibility</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NavService } from '../../services/nav.service';
import { Logo } from '../logo/logo';
import { FooterSocials } from './components/footer-socials/footer-socials';
import { FooterSupport } from './components/footer-support/footer-support';
import { FooterLinkCol, FooterLink } from './components/footer-link-col/footer-link-col';
import { FooterBottom } from './components/footer-bottom/footer-bottom';

@Component({
  selector: 'ui-footer',
  standalone: true,
  imports: [Logo, FooterSocials, FooterSupport, FooterLinkCol, FooterBottom],
  templateUrl: './ui-footer.html',
  styleUrl: './ui-footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiFooter {
  private readonly nav = inject(NavService);

  readonly companyLinks: FooterLink[] = [
    { label: 'Home', action: () => this.nav.goHome() },
    { label: 'About Us', routerLink: '/about' },
    { label: 'Products', action: () => this.nav.goProducts() },
    { label: 'Contact Us', action: () => this.nav.goContact() },
  ];

  readonly userLinks: FooterLink[] = [
    { label: 'Account', routerLink: '/profile' },
    { label: 'Cart', routerLink: '/cart' },
  ];
}

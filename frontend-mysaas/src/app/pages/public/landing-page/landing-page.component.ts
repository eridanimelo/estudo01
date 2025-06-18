import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { FAQ, FAQSPublicervice } from '../../../services/faq-public.service';



@Component({
  selector: 'app-landing-page',
  standalone: true,
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
  imports: [
    CommonModule, MatButtonModule, MatExpansionModule, MatIconModule, RouterModule,
  ],
})
export class LandingPageComponent implements OnInit {


  faqs: FAQ[] = [];

  constructor(
    @Inject(DOCUMENT) private document: Document,

    private faqPublicService: FAQSPublicervice
  ) { }

  ngOnInit(): void {
    this.faqPublicService.getAllFAQs().subscribe({
      next: (faqs) => {
        this.faqs = faqs;
      }, error: (err) => {
        console.error(err);
      }

    });

  }



  menuVisible: boolean = false;


  // Método para alternar a visibilidade do menu
  toggleMenu() {
    this.menuVisible = !this.menuVisible;
  }

  // Método para fechar o menu ao clicar em um item
  closeMenu() {
    this.menuVisible = false;
  }



  scrollTo(sectionId: string): void {
    setTimeout(() => {
      const targetElement = this.document.getElementById(sectionId);
      if (targetElement) {
        const offset = 100;
        const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    }, 100); // Ajuste o tempo, se necessário
  }


}

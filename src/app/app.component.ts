import { Component } from "@angular/core";
import { ComissaoComponent } from "./comissao/comissao.component";
import { EstoqueComponent } from "./estoque/estoque.component";
import { JurosComponent } from "./juros/juros.component";

type Aba = "comissao" | "estoque" | "juros";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [ComissaoComponent, EstoqueComponent, JurosComponent],
  template: `
    <main>
      <nav>
        <button [class.ativo]="aba === 'comissao'" (click)="aba = 'comissao'">
          1. Comissões
        </button>
        <button [class.ativo]="aba === 'estoque'" (click)="aba = 'estoque'">
          2. Estoque
        </button>
        <button [class.ativo]="aba === 'juros'" (click)="aba = 'juros'">
          3. Juros
        </button>
      </nav>

      @switch (aba) {
        @case ("comissao") {
          <app-comissao />
        }
        @case ("estoque") {
          <app-estoque />
        }
        @case ("juros") {
          <app-juros />
        }
      }
    </main>
  `,
  styles: `
    main {
      width: min(60rem, 100%);
      padding: 2rem;
      border-radius: 1rem;
      background: #fff;
      box-shadow: 0 20px 50px rgb(15 23 42 / 10%);
    }

    nav {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }

    nav button.ativo {
      background: #7c3aed;
      color: #fff;
    }
  `,
})
export class AppComponent {
  aba: Aba = "comissao";
}

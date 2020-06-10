import { Component, OnInit } from '@angular/core';
import { RequisicaoItemModel } from '../../model/requisicao-item-model';
import { RequisicaoModel, StatusReq } from '../../model/requisicao-model';
import { RequisicaoService } from '../../service/requisicao.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from 'src/app/user/service/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-requisicao-create',
  templateUrl: './requisicao-create.component.html',
  styleUrls: ['./requisicao-create.component.css']
})
export class RequisicaoCreateComponent implements OnInit {

  itensForm: FormGroup;
  requisicaoForm: FormGroup;

  requisicao: RequisicaoModel;
  item: RequisicaoItemModel;
  itens: RequisicaoItemModel[] = [];
  dataSource = new MatTableDataSource<any>();

  displayedColumns = ['descricao', 'quantidade'];

  constructor(private requisicaoService: RequisicaoService,
    private router: Router,
    private snackBar: MatSnackBar,
    private userService: UserService,
    private formBuilder: FormBuilder) {
    this.requisicao = new RequisicaoModel();
    this.item = new RequisicaoItemModel();
  }

  ngOnInit(): void {
    this.itensForm = this.formBuilder.group({
      descricaoProduto: ['', Validators.required],
      quantidade: ['', Validators.required],
    });
    this.requisicaoForm = this.formBuilder.group({
      observacao: ['', Validators.required],
    });
  }

  get formItensData() {
    return this.itensForm.controls;
  }

  get formRequisicaoData() {
    return this.requisicaoForm.controls;
  }

  showMessage(msg: string): void {
    this.snackBar.open(msg, "", {
      duration: 4000,
      horizontalPosition: "end",
      verticalPosition: "top"
    })
  }

  createRequisicao(): void {
    // stop here if form is invalid
    if (this.requisicaoForm.invalid) {
      this.showMessage("Verifique os Campos e tente novamente!");
      return;
    }

    if (this.itens.length > 0) {
      if (this.userService.currentUser) {
        this.requisicao.solicitante = this.userService.currentUser;
        this.requisicao.itens = this.itens;
        this.requisicao.data = new Date;
        this.requisicao.status = StatusReq.CRIADO;
        this.requisicaoService.create(this.requisicao).subscribe(
          () => {
            this.showMessage("Requisição Realizada com Sucesso!!");
            this.cancel();
          }, error => console.log(error));
      } else {
        this.showMessage("Não foi possível salvar a Requisição. Verifique seu Login!!");
        return;
      }
    } else {
      this.showMessage("Por Favor, insira algum Item!!");
    }
  }

  addItem(): void {
    // stop here if form is invalid
    if (this.itensForm.invalid) {
      this.showMessage("Verifique os Campos e tente novamente!");
      return;
    }

    if (this.item.quantidade < 1) {
      this.showMessage("Por Favor, insira uma Quantidade Válida!!");
    } else {
      this.itens.push(this.item);
      this.item = new RequisicaoItemModel();
      this.dataSource.data = this.itens;
    }
  }

  cancel(): void {
    this.router.navigate(['/requisicao/list']);
  }

}

import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import {
  AddRequest,
  AddResponse,
  DeleteRequest,
  DeleteResponse,
  GetRequest,
  GetResponse,
  HERO_CR_UD_SERVICE_NAME,
  Hero,
  HeroCRUDServiceController,
  UpdateRequest,
  UpdateResponse,
  HeroCRUDServiceControllerMethods,
  FightRequest,
  FightResponse,
} from './stubs/hero/v1alpha/hero';
import { GrpcMethod } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';

@Controller()
@HeroCRUDServiceControllerMethods()
export class AppController implements HeroCRUDServiceController {
  constructor(private readonly appService: AppService) { }
  async get(request: GetRequest, metadata?: Metadata): Promise<GetResponse> {
    let hero: Hero;
    let heroes: Hero[] = [];

    if (request.id) {
      hero = await this.appService.findById(request.id);
      return { heroes: [hero] };
    } else if (request.name) {
      hero = await this.appService.findByName(request.name);
      return { heroes: [hero] };
    } else {
      heroes = await this.appService.findAll();
      return { heroes };
    }
  }
  async update(
    request: UpdateRequest,
    metadata?: Metadata,
  ): Promise<UpdateResponse> {
    const id = request.id;

    Object.keys(request).forEach(
      (key) => request[key] === undefined && delete request[key],
    );

    delete request.id;

    const hero = await this.appService.update(id, request);

    return { hero };
  }
  async delete(
    request: DeleteRequest,
    metadata?: Metadata,
  ): Promise<DeleteResponse> {
    const hero = await this.appService.delete(request.id);

    return { hero };
  }

  async fight(request: FightRequest, metadata?: Metadata): Promise<FightResponse> {
    const hero1 = await this.appService.findById(request.id1);
    const hero2 = await this.appService.findById(request.id2);
    hero1.hp -= hero2.power;
    hero2.hp -= hero1.power;

    const hero1updated = await this.appService.update(hero1.id, hero1)
    const hero2updated = await this.appService.update(hero2.id, hero2)

    return { hero1: hero1updated as any, hero2: hero2updated as any }
  }

  @GrpcMethod(HERO_CR_UD_SERVICE_NAME)
  async add(request: AddRequest): Promise<AddResponse> {
    const hero = await this.appService.create(request as any);

    return { hero };
  }
}

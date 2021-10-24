import { Injectable } from "@nestjs/common";

@Injectable()
export class FirebaseService {

  constructor(private readonly firebase: any) { }

}

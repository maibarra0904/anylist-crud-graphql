import { Injectable, UnauthorizedException } from '@nestjs/common';


import { AuthResponse } from './types/auth-response.type';
import { UsersService } from 'src/users/users.service';
import { LoginInput, SignupInput } from './dto/input';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,

    ) {}

    private getJwtToken(userId: string) {
        return this.jwtService.sign({id: userId})
    }

    async signup(signupInput: SignupInput): Promise<AuthResponse> {

        const user = await this.usersService.create(signupInput);
        const token = this.getJwtToken(user.id)

        return {token, user}

    }

    async login ( loginInput: LoginInput): Promise<AuthResponse> {

        const {email, password} = loginInput
        const user = await this.usersService.findOneByEmail( email) 

        if (!bcrypt.compare(password, user.password)) {
            throw new Error("Invalid credentials")
        }

        const token = this.getJwtToken(user.id)

        return {
            token,
            user
        }
    }

    async validateUser(id: string): Promise<User> {

        const user = await this.usersService.findOneById(id)

        if (!user.isActive) throw new UnauthorizedException(`User is inactive, talk with an admin`);

        delete user.password;

        return user

    }

    revalidateToken( user: User ): AuthResponse {

        const token = this.getJwtToken( user.id );

        return { token, user };

    }
}

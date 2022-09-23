import { Injectable } from '@nestjs/common';
import { DeliveryStatus, PAGE_SIZE, Sort } from 'src/common/valuable.utils';
import { OrderEntity } from '../entity/order.entity';
import { UserEntity } from '../entity/user.entity';
import { DataSource } from 'typeorm';
import { response } from '../config/response.utils';
import { makeResponse } from '../config/function.utils';
import { CouponEntity } from '../entity/coupon.entity';
import {PostOrderRequestDto} from "./dto/post-order-request.dto";

@Injectable()
export class OrderService {
  constructor(private dataSource: DataSource) {}
  async retrieveOrders(sort, name, status, p) {
    try {
      let orders = [];

      // query 생성
      const queryResult = this.dataSource.createQueryBuilder(
        OrderEntity,
        'order',
      );

      queryResult.leftJoin(UserEntity, 'user', 'user.id = order.userId');

      // 상태값 필터
      if (status == DeliveryStatus.BEFORE) {
        await queryResult.andWhere(
          'order.deliveryStatus IN (:deliveryStatus)',
          {
            deliveryStatus: DeliveryStatus.BEFORE,
          },
        );
      } else if (status == DeliveryStatus.ONGOING) {
        await queryResult.andWhere(
          'order.deliveryStatus IN (:deliveryStatus)',
          {
            deliveryStatus: DeliveryStatus.ONGOING,
          },
        );
      } else if (status == DeliveryStatus.COMPLETE) {
        await queryResult.andWhere(
          'order.deliveryStatus IN (:deliveryStatus)',
          {
            deliveryStatus: DeliveryStatus.COMPLETE,
          },
        );
      }

      // 날짜순 내림차순, 오름차순 정렬
      if (sort == Sort.CREATEDAT) {
        await queryResult.orderBy('order.createAt', 'DESC');
      } else if (sort == Sort.ENDEDAT) {
        await queryResult.orderBy('order.endedAt', 'DESC');
      }

      await queryResult
        .select([
          'order.id as id',
          'order.createAt as createdAt',
          'order.deliveryStatus as deliveryStatus',
          'order.endedAt as endedAt',
        ])
        .addSelect(['user.name as name']);

      let page = 0;
      // 페이징;
      if (p) {
        if (p <= 0) {
          // 에러 처리
          p = 1;
        } else {
          page = (p - 1) * PAGE_SIZE;
        }
        await queryResult.take(PAGE_SIZE).skip(page);
      }

      // 조회
      orders = await queryResult.getRawMany();

      const data = {
        orders: orders,
      };

      const result = makeResponse(response.SUCCESS, data);

      return result;
    } catch (error) {
      console.log(error);
      return response.ERROR;
    }
  }

  async patchDelivery(id) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // board 수정
      await queryRunner.manager.update(
        OrderEntity,
        { id: id },
        { deliveryStatus: DeliveryStatus.ONGOING },
      );

      const data = {
        message: '배송중으로 변경하였습니다.',
      };

      const result = makeResponse(response.SUCCESS, data);

      // Commit
      await queryRunner.commitTransaction();

      return result;
    } catch (error) {
      // Rollback
      await queryRunner.rollbackTransaction();
      console.log(error);
      return response.ERROR;
    } finally {
      await queryRunner.release();
    }
  }

  async postOrder(postOrderRequestDto: PostOrderRequestDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const order = new OrderEntity();
      order.userId = postOrderRequestDto.userId;
      order.price = postOrderRequestDto.price;
      order.deliveryStatus = DeliveryStatus.BEFORE;
      order.couponId = postOrderRequestDto.couponId;
      await queryRunner.manager.save(order);

      const data = {
        message: '배송중으로 변경하였습니다.',
      };

      const result = makeResponse(response.SUCCESS, data);

      // Commit
      await queryRunner.commitTransaction();

      return result;
    } catch (error) {
      // Rollback
      await queryRunner.rollbackTransaction();
      console.log(error);
      return response.ERROR;
    } finally {
      await queryRunner.release();
    }
  }

  async retrieveCoupons() {
    try {
      let orders = [];

      // query 생성
      const queryResult = this.dataSource.createQueryBuilder(
        CouponEntity,
        'coupon',
      );

      queryResult.leftJoin(UserEntity, 'user', 'user.id = coupon.userId');

      await queryResult
        .select([
          'coupon.id as id',
          'coupon.createAt as createdAt',
          'coupon.type as type',
          'coupon.percent as percent',
          'coupon.price as price',
        ])
        .addSelect([
          'user.name as name',
          'user.city as city',
          'user.zip as zip',
        ]);

      // 조회
      orders = await queryResult.getRawMany();

      const data = {
        orders: orders,
      };

      const result = makeResponse(response.SUCCESS, data);

      return result;
    } catch (error) {
      console.log(error);
      return response.ERROR;
    }
  }

  async retrieveCouponPrice() {
    try {
      let orders = [];

      // query 생성
      const queryResult = this.dataSource.createQueryBuilder(
        CouponEntity,
        'coupon',
      );

      queryResult.leftJoin(UserEntity, 'user', 'user.id = coupon.userId');

      await queryResult
        .select([
          'coupon.id as id',
          'coupon.createAt as createdAt',
          'coupon.type as type',
          'coupon.percent as percent',
          'coupon.price as price',
        ])
        .addSelect([
          'user.name as name',
          'user.city as city',
          'user.zip as zip',
        ]);

      // 조회
      orders = await queryResult.getRawMany();

      const data = {
        orders: orders,
      };

      const result = makeResponse(response.SUCCESS, data);

      return result;
    } catch (error) {
      console.log(error);
      return response.ERROR;
    }
  }
}

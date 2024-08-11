import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Injectable()
export class InvoiceService {
  constructor(private prisma: PrismaService) {}

  async create(createInvoiceDto: CreateInvoiceDto) {
    const { customerName, invoiceNumber, totalAmount, paymentStatus, files } =
      createInvoiceDto;
    try {
      const invoice = await this.prisma.invoice.create({
        data: {
          customerName,
          invoiceNumber,
          totalAmount,
          paymentStatus,
          files: {
            create: files,
          },
        },
        include: { files: true },
      });
      return this.createSuccessResponse(
        'Invoice created successfully',
        invoice,
      );
    } catch (error) {
      this.handlePrismaError(error, 'Error creating invoice');
    }
  }

  async findAll() {
    try {
      const invoices = await this.prisma.invoice.findMany({
        include: { files: true },
      });
      return this.createSuccessResponse(
        'Invoices retrieved successfully',
        invoices,
      );
    } catch (error) {
      this.handlePrismaError(error, 'Error retrieving invoices');
    }
  }

  async findOne(id: number) {
    try {
      const invoice = await this.prisma.invoice.findUnique({
        where: { id },
        include: { files: true },
      });
      if (!invoice) {
        throw new NotFoundException('Invoice not found');
      }
      return this.createSuccessResponse(
        'Invoice retrieved successfully',
        invoice,
      );
    } catch (error) {
      this.handlePrismaError(error, 'Error retrieving invoice');
    }
  }

  async update(id: number, updateInvoiceDto: UpdateInvoiceDto) {
    try {
      const updatedInvoice = await this.prisma.invoice.update({
        where: { id },
        data: {
          ...updateInvoiceDto,
          files: {
            deleteMany: updateInvoiceDto.files ? {} : undefined, // delete existing files only if new files are provided
            create: updateInvoiceDto.files || [], // create new files only if provided
          },
        },
        include: { files: true },
      });
      return this.createSuccessResponse(
        'Invoice updated successfully',
        updatedInvoice,
      );
    } catch (error) {
      this.handlePrismaError(error, 'Error updating invoice');
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.file.deleteMany({ where: { invoiceId: id } });
      const deletedInvoice = await this.prisma.invoice.delete({
        where: { id },
      });
      return this.createSuccessResponse(
        'Invoice deleted successfully',
        deletedInvoice,
      );
    } catch (error) {
      this.handlePrismaError(error, 'Error deleting invoice');
    }
  }

  private createSuccessResponse(message: string, data: any) {
    return {
      message,
      data,
    };
  }

  private handlePrismaError(error: any, defaultMessage: string) {
    if (error.code === 'P2025') {
      throw new NotFoundException('Invoice not found');
    }
    throw new InternalServerErrorException(defaultMessage);
  }
}

#
# Makefile - Intel Management Engine Interface (Intel MEI) Linux driver
# Copyright (c) 2010-2014, Intel Corporation.
#

KVER  := $(shell uname -r)
KSRC := /lib/modules/$(KVER)/build
PWD := $(shell pwd)

obj-$(CONFIG_INTEL_MEI) += mei.o
mei-objs := init.o
mei-objs += hbm.o
mei-objs += interrupt.o
mei-objs += client.o
mei-objs += main.o
mei-objs += amthif.o
mei-objs += bus.o
mei-objs += bus-fixup.o
mei-$(CONFIG_DEBUG_FS) += debugfs.o

obj-$(CONFIG_INTEL_MEI_ME) += mei-me.o
mei-me-objs := pci-me.o
mei-me-objs += hw-me.o

obj-$(CONFIG_INTEL_MEI_ME) += mei-txe.o
mei-txe-objs := pci-txe.o
mei-txe-objs += hw-txe.o

mei-$(CONFIG_EVENT_TRACING) += mei-trace.o
CFLAGS_mei-trace.o = -I$(src)

all:
	@echo $(CONFIG_INTEL_MEI_ME)
	@echo $(CONFIG_INTEL_MEI_TXE)
	@echo $(KVER)
	$(MAKE) -C $(KSRC) M=$(PWD) modules

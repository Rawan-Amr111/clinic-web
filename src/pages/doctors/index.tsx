import React, { useState } from "react";
import type { DoctorStatus, GetDoctorsResponse } from "../../domain/doctor";
import AddDoctorModal, {
  type NewDoctorData,
} from "./components/adddoctormodal/AddDoctorModal";
import DoctorsFilters from "./components/doctorsfilters/DoctorsFilters";
import DoctorsGrid from "./components/doctorsgrid/DoctorsGrid";
import DoctorsHeader from "./components/doctorsheader/DoctorsHeader";
import classes from "./index.module.css";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  addDoctor,
  getDoctors,
  getSpecialties,
  updateDoctorStatus,
} from "../../services/doctors";
import { useDebounce } from "../../hooks/useDebounce";
import { Pagination } from "antd";

const DoctorsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [status, setStatus] = useState("");
  const debouncedSearch = useDebounce(search, 400);
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const {
    data: { doctors = [], total = 0 } = {},
    isLoading,
    isError,
    isFetching,
  } = useQuery<GetDoctorsResponse>({
    queryKey: ["doctors", page, pageSize, debouncedSearch, specialty, status],
    queryFn: () =>
      getDoctors({
        page,
        pageSize,
        search: debouncedSearch,
        specialty,
        status,
      }),
    staleTime: 60 * 1000,
    placeholderData: keepPreviousData,
  });

  const { data: specialties = [] } = useQuery({
    queryKey: ["doctor-specialties"],
    queryFn: getSpecialties,
    staleTime: 5 * 60 * 1000,
  });

  const queryClient = useQueryClient();

  const { mutate: toggleDoctorStatus, isPending: isUpdatingStatus } =
    useMutation({
      mutationFn: ({
        doctorId,
        status,
      }: {
        doctorId: string;
        status: DoctorStatus;
      }) => updateDoctorStatus(doctorId, status),

      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["doctors"] });
      },
    });

  const { mutate: createDoctor, isPending: isCreatingDoctor } = useMutation({
    mutationFn: addDoctor,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: ["doctor-specialties"] });

      setIsModalOpen(false);
    },
  });

  const handleAddDoctor = (doctor: NewDoctorData) => {
    createDoctor({
      name: doctor.name,
      specialty: doctor.specialty,
    });
  };
  if (isLoading) {
    return <p>Loading doctors...</p>;
  }
  if (isError) {
    return <p>Error loading doctors. Please try again later.</p>;
  }
  return (
    <main className={classes.container}>
      <DoctorsHeader onAddDoctor={() => setIsModalOpen(true)} />

      <DoctorsFilters
        search={search}
        specialties={specialties}
        specialty={specialty}
        status={status}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        onSpecialtyChange={(value) => {
          setSpecialty(value);
          setPage(1);
        }}
        onStatusChange={(value) => {
          setStatus(value);
          setPage(1);
        }}
      />
      {isFetching && <span>Updating...</span>}

      <DoctorsGrid
        doctors={doctors}
        isUpdatingStatus={isUpdatingStatus}
        onToggleStatus={(doctorId, currentStatus) => {
          const nextStatus = currentStatus === "Active" ? "Inactive" : "Active";

          toggleDoctorStatus({
            doctorId,
            status: nextStatus,
          });
        }}
      />
      <div className={classes.pagination}>
        <Pagination
          current={page}
          pageSize={pageSize}
          total={total}
          showSizeChanger={false}
          onChange={(nextPage) => setPage(nextPage)}
        />
      </div>

      {isModalOpen && (
        <AddDoctorModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleAddDoctor}
          specialties={specialties}
          isSaving={isCreatingDoctor}
        />
      )}
    </main>
  );
};

export default DoctorsPage;

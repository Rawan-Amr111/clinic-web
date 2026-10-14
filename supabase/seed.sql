-- Demo data for ClinicFlow. Safe to run more than once.
-- Appointments are created through the same RPC used by the app so that
-- queue entries are created by the database's normal workflow.

insert into public.doctors (id, name, specialty, status, image)
values
  ('10000000-0000-4000-8000-000000000001', 'Dr. Salma Hassan', 'Cardiology', 'Active', null),
  ('10000000-0000-4000-8000-000000000002', 'Dr. Omar Adel', 'Dermatology', 'Active', null),
  ('10000000-0000-4000-8000-000000000003', 'Dr. Nour Farid', 'Pediatrics', 'Active', null),
  ('10000000-0000-4000-8000-000000000004', 'Dr. Karim Nabil', 'Orthopedics', 'Active', null),
  ('10000000-0000-4000-8000-000000000005', 'Dr. Mariam Sameh', 'Neurology', 'Active', null)
on conflict (id) do update set
  name = excluded.name,
  specialty = excluded.specialty,
  status = excluded.status,
  image = excluded.image;

insert into public.patients (id, full_name, phone, email, date_of_birth, gender)
values
  ('20000000-0000-4000-8000-000000000001', 'Ahmed khaled', '01010000001', 'ahmed.khaled.demo@clinicflow.test', '1990-04-12', 'Male'),
  ('20000000-0000-4000-8000-000000000002', 'Mariam Khaled', '01010000002', 'mariam.khaled.demo@clinicflow.test', '1987-09-23', 'Female'),
  ('20000000-0000-4000-8000-000000000003', 'Omar Ibrahim', '01010000003', 'omar.ibrahim.demo@clinicflow.test', '2001-01-05', 'Male'),
  ('20000000-0000-4000-8000-000000000004', 'Nour Mostafa', '01010000004', 'nour.mostafa.demo@clinicflow.test', '1995-06-17', 'Female'),
  ('20000000-0000-4000-8000-000000000005', 'Adam Hany', '01010000005', 'adam.hany.demo@clinicflow.test', '2015-11-02', 'Male'),
  ('20000000-0000-4000-8000-000000000006', 'Farida Tarek', '01010000006', 'farida.tarek.demo@clinicflow.test', '2018-03-14', 'Female'),
  ('20000000-0000-4000-8000-000000000007', 'Laila Samir', '01010000007', 'laila.samir.demo@clinicflow.test', '1978-08-30', 'Female'),
  ('20000000-0000-4000-8000-000000000008', 'Seif Mahmoud', '01010000008', 'seif.mahmoud.demo@clinicflow.test', '1983-12-09', 'Male'),
  ('20000000-0000-4000-8000-000000000009', 'Jana Ashraf', '01010000009', 'jana.ashraf.demo@clinicflow.test', '1999-02-21', 'Female'),
  ('20000000-0000-4000-8000-000000000010', 'Malek Fathy', '01010000010', 'malek.fathy.demo@clinicflow.test', '2008-07-04', 'Male'),
  ('20000000-0000-4000-8000-000000000011', 'Hana Wael', '01010000011', 'hana.wael.demo@clinicflow.test', '1969-10-18', 'Female'),
  ('20000000-0000-4000-8000-000000000012', 'Ziad Ehab', '01010000012', 'ziad.ehab.demo@clinicflow.test', '1992-05-27', 'Male')
on conflict (id) do update set
  full_name = excluded.full_name,
  phone = excluded.phone,
  email = excluded.email,
  date_of_birth = excluded.date_of_birth,
  gender = excluded.gender;

do $$
declare
  appointment_seed record;
  appointment_time timestamptz;
begin
  for appointment_seed in
    select * from (values
      ('20000000-0000-4000-8000-000000000001'::uuid, '10000000-0000-4000-8000-000000000001'::uuid, time '09:00', 'General checkup'),
      ('20000000-0000-4000-8000-000000000002'::uuid, '10000000-0000-4000-8000-000000000001'::uuid, time '09:30', 'Cardiology follow-up'),
      ('20000000-0000-4000-8000-000000000003'::uuid, '10000000-0000-4000-8000-000000000002'::uuid, time '10:00', 'Skin consultation'),
      ('20000000-0000-4000-8000-000000000004'::uuid, '10000000-0000-4000-8000-000000000003'::uuid, time '10:30', 'Pediatric checkup'),
      ('20000000-0000-4000-8000-000000000005'::uuid, '10000000-0000-4000-8000-000000000003'::uuid, time '11:00', 'Seasonal allergy'),
      ('20000000-0000-4000-8000-000000000006'::uuid, '10000000-0000-4000-8000-000000000004'::uuid, time '11:30', 'Joint pain assessment'),
      ('20000000-0000-4000-8000-000000000007'::uuid, '10000000-0000-4000-8000-000000000005'::uuid, time '12:00', 'Neurology consultation'),
      ('20000000-0000-4000-8000-000000000008'::uuid, '10000000-0000-4000-8000-000000000004'::uuid, time '12:30', 'Back pain follow-up'),
      ('20000000-0000-4000-8000-000000000009'::uuid, '10000000-0000-4000-8000-000000000002'::uuid, time '13:00', 'Dermatology follow-up'),
      ('20000000-0000-4000-8000-000000000010'::uuid, '10000000-0000-4000-8000-000000000003'::uuid, time '13:30', 'Routine pediatric visit'),
      ('20000000-0000-4000-8000-000000000011'::uuid, '10000000-0000-4000-8000-000000000001'::uuid, time '14:00', 'Blood pressure follow-up'),
      ('20000000-0000-4000-8000-000000000012'::uuid, '10000000-0000-4000-8000-000000000005'::uuid, time '14:30', 'Headache consultation')
    ) as seed(patient_id, doctor_id, appointment_time, reason)
  loop
    appointment_time :=
      (timezone('Africa/Cairo', now())::date + appointment_seed.appointment_time)
      at time zone 'Africa/Cairo';

    if not exists (
      select 1
      from public.appointments
      where patient_id = appointment_seed.patient_id
        and doctor_id = appointment_seed.doctor_id
        and appointment_at = appointment_time
        and reason = '[DEMO] ' || appointment_seed.reason
    ) then
      perform public.create_appointment_with_queue(
        p_patient_id := appointment_seed.patient_id,
        p_doctor_id := appointment_seed.doctor_id,
        p_appointment_at := appointment_time,
        p_duration_minutes := 30,
        p_reason := '[DEMO] ' || appointment_seed.reason,
        p_add_to_queue := true
      );
    end if;
  end loop;
end;
$$;

-- Future visits stay out of today's live queue but appear as Upcoming in
-- Appointments and in each patient's visit history.
do $$
declare
  appointment_seed record;
  appointment_time timestamptz;
begin
  for appointment_seed in
    select * from (values
      ('20000000-0000-4000-8000-000000000001'::uuid, '10000000-0000-4000-8000-000000000001'::uuid, 1, time '09:00', 'Cardiology follow-up'),
      ('20000000-0000-4000-8000-000000000002'::uuid, '10000000-0000-4000-8000-000000000002'::uuid, 1, time '10:00', 'Dermatology review'),
      ('20000000-0000-4000-8000-000000000003'::uuid, '10000000-0000-4000-8000-000000000005'::uuid, 2, time '09:30', 'Headache follow-up'),
      ('20000000-0000-4000-8000-000000000004'::uuid, '10000000-0000-4000-8000-000000000003'::uuid, 2, time '10:30', 'Pediatric follow-up'),
      ('20000000-0000-4000-8000-000000000005'::uuid, '10000000-0000-4000-8000-000000000003'::uuid, 3, time '11:00', 'Allergy review'),
      ('20000000-0000-4000-8000-000000000006'::uuid, '10000000-0000-4000-8000-000000000004'::uuid, 3, time '12:00', 'Orthopedic follow-up'),
      ('20000000-0000-4000-8000-000000000007'::uuid, '10000000-0000-4000-8000-000000000005'::uuid, 4, time '09:00', 'Neurology review'),
      ('20000000-0000-4000-8000-000000000008'::uuid, '10000000-0000-4000-8000-000000000001'::uuid, 4, time '11:30', 'Blood pressure check'),
      ('20000000-0000-4000-8000-000000000009'::uuid, '10000000-0000-4000-8000-000000000002'::uuid, 5, time '10:30', 'Skin follow-up'),
      ('20000000-0000-4000-8000-000000000010'::uuid, '10000000-0000-4000-8000-000000000004'::uuid, 6, time '12:30', 'Joint assessment'),
      ('20000000-0000-4000-8000-000000000011'::uuid, '10000000-0000-4000-8000-000000000001'::uuid, 7, time '09:30', 'Cardiology review'),
      ('20000000-0000-4000-8000-000000000012'::uuid, '10000000-0000-4000-8000-000000000005'::uuid, 7, time '13:00', 'Neurology follow-up')
    ) as seed(patient_id, doctor_id, days_from_today, appointment_time, reason)
  loop
    appointment_time :=
      (timezone('Africa/Cairo', now())::date
        + appointment_seed.days_from_today
        + appointment_seed.appointment_time)
      at time zone 'Africa/Cairo';

    if not exists (
      select 1
      from public.appointments
      where patient_id = appointment_seed.patient_id
        and doctor_id = appointment_seed.doctor_id
        and appointment_at = appointment_time
        and reason = '[DEMO UPCOMING] ' || appointment_seed.reason
    ) then
      perform public.create_appointment_with_queue(
        p_patient_id := appointment_seed.patient_id,
        p_doctor_id := appointment_seed.doctor_id,
        p_appointment_at := appointment_time,
        p_duration_minutes := 30,
        p_reason := '[DEMO UPCOMING] ' || appointment_seed.reason,
        p_add_to_queue := false
      );
    end if;
  end loop;
end;
$$;

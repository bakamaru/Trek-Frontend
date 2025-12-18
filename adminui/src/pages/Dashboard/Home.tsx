import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
import RecentOrders from "../../components/ecommerce/RecentOrders";
import DemographicCard from "../../components/ecommerce/DemographicCard";
import PageMeta from "../../components/common/PageMeta";
import { useGetBookingDashboardSummaryQuery } from "../../redux/trek/bookingAPI";
import AnalyticsEmbed from "../../components/analytics/AnalyticsEmbed";

export default function Home() {
  const { data: summaryData } = useGetBookingDashboardSummaryQuery();

  return (
    <>
      <PageMeta
        title="Dashboard || Trek Admin"
        description=""
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-12">
          <EcommerceMetrics data={summaryData?.Data} />

          <AnalyticsEmbed embedUrl={"https://lookerstudio.google.com/embed/reporting/e21aef96-b257-4410-8f3b-d46a739c70fe/page/p_ev5o6t54bd"} />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
          {/* <AnalyticsEmbed embedUrl={"https://lookerstudio.google.com/embed/reporting/e21aef96-b257-4410-8f3b-d46a739c70fe/page/kIV1C"} />
          <AnalyticsEmbed embedUrl={"https://lookerstudio.google.com/embed/reporting/e21aef96-b257-4410-8f3b-d46a739c70fe/page/p_ev5o6t54bd"} />
          <AnalyticsEmbed embedUrl={"https://lookerstudio.google.com/embed/reporting/e21aef96-b257-4410-8f3b-d46a739c70fe/page/p_m63q9t54bd"} />
        */}
        </div>
        {/*
        
        To get the "Embed URL" for your Looker Studio report, follow these steps:

Open your report in Edit mode.
Click on File in the top menu.
Select Embed report.
Check the box Enable embedding.
Select Embed URL (not Embed Code).
Copy the URL that appears (it should start with https://lookerstudio.google.com/embed/...).
        <div className="col-span-12">
          <StatisticsChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <DemographicCard />
        </div>

        <div className="col-span-12 xl:col-span-7">
          <RecentOrders />
        </div> */}
      </div>
    </>
  );
}

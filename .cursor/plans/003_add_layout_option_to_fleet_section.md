# Add layout option to fleet section
- review src/components/section-supercar-fleet-grid
- note the new layout field in SectionSupercarGridConfig
- when layout === 'stacked'
  - disable tab behavior
  - in handleTabClick
  - scroll the use to the specific grid
